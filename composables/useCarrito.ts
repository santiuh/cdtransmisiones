import { MAX_POR_ITEM, maximoUnidades, puedeComprar, type TiendaItem } from "~/utils/tienda";

// Carrito del sitio: vive en localStorage SOLO como { item_id, qty } — nombres,
// precios y fotos se resuelven contra el catálogo SSR en cada render, así nunca
// se muestra un precio viejo. Al finalizar, el carrito viaja a la plataforma
// (POST checkout-sessions) y el visitante sigue en el checkout hosteado, donde
// elige envío/retiro y forma de pago. Mismo contrato que el widget express.
const KEY = "imoberdorf:carrito:v1";

export interface LineaCarrito {
  item_id: string;
  qty: number;
}

export interface LineaResuelta extends LineaCarrito {
  item: TiendaItem | null;
  disponible: boolean;
  unitario: number | null;
  subtotal: number;
}

export interface AvisoCarrito {
  id: number;
  texto: string;
  link?: string;
  linkTexto?: string;
}

let escuchandoStorage = false;

function leerStorage(): LineaCarrito[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .filter(
        (l): l is LineaCarrito =>
          !!l && typeof l.item_id === "string" && Number.isInteger(l.qty) && l.qty > 0,
      )
      .map((l) => ({ item_id: l.item_id, qty: Math.min(MAX_POR_ITEM, l.qty) }));
  } catch {
    return [];
  }
}

export function useCarrito() {
  const lineas = useState<LineaCarrito[]>("carrito-lineas", () => []);
  // false hasta montar: SSR y primer render del cliente coinciden (carrito vacío)
  // y recién después se lee localStorage → sin desajuste de hidratación.
  const listo = useState<boolean>("carrito-listo", () => false);
  const aviso = useState<AvisoCarrito | null>("carrito-aviso", () => null);

  function cargar() {
    if (!import.meta.client || listo.value) return;
    lineas.value = leerStorage();
    listo.value = true;
    if (!escuchandoStorage) {
      escuchandoStorage = true;
      window.addEventListener("storage", (e) => {
        if (e.key === KEY) lineas.value = leerStorage();
      });
    }
  }
  if (import.meta.client && getCurrentInstance()) onMounted(cargar);

  function guardar(next: LineaCarrito[]) {
    lineas.value = next;
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* modo privado / storage lleno: el carrito vive en memoria igual */
    }
  }

  const cantidad = computed(() => lineas.value.reduce((a, l) => a + l.qty, 0));

  function avisar(texto: string, link?: string, linkTexto?: string) {
    aviso.value = { id: Date.now(), texto, link, linkTexto };
  }

  /** Suma `qty` unidades del item (respeta stock y el tope por línea). Devuelve la cantidad final. */
  function agregar(item: TiendaItem, qty = 1): number {
    const max = maximoUnidades(item);
    const actual = lineas.value.find((l) => l.item_id === item.id);
    const nueva = Math.min(max, (actual?.qty ?? 0) + Math.max(1, Math.floor(qty)));
    if (nueva <= 0) return 0;
    const next = actual
      ? lineas.value.map((l) => (l.item_id === item.id ? { ...l, qty: nueva } : l))
      : [...lineas.value, { item_id: item.id, qty: nueva }];
    guardar(next);
    avisar(`Agregaste ${item.name} al carrito`, "/Productos/carrito", "Ver carrito");
    return nueva;
  }

  function fijar(item_id: string, qty: number) {
    if (qty <= 0) return quitar(item_id);
    guardar(
      lineas.value.map((l) =>
        l.item_id === item_id ? { ...l, qty: Math.min(MAX_POR_ITEM, Math.floor(qty)) } : l,
      ),
    );
  }

  function quitar(item_id: string) {
    guardar(lineas.value.filter((l) => l.item_id !== item_id));
  }

  function vaciar() {
    guardar([]);
  }

  /** Cruza las líneas guardadas con el catálogo actual (precio/stock/tienda de HOY). */
  function resolver(porId: Map<string, TiendaItem>, shopEnabled: boolean): LineaResuelta[] {
    return lineas.value.map((l) => {
      const item = porId.get(l.item_id) ?? null;
      const disponible = !!item && puedeComprar(item, shopEnabled);
      const unitario = disponible ? item!.price_ars : null;
      return { ...l, item, disponible, unitario, subtotal: unitario == null ? 0 : unitario * l.qty };
    });
  }

  /**
   * Crea la sesión de checkout en la plataforma y devuelve la URL del checkout
   * hosteado. No vacía el carrito: eso lo hace quien redirige, después del OK.
   */
  async function crearCheckout(
    items: LineaCarrito[],
  ): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
    const cfg = useRuntimeConfig().public;
    try {
      const r = await $fetch<{ checkout_url?: string }>(
        `${cfg.smsApiBase}/api/public/sites/${cfg.smsSiteId}/shop/checkout-sessions`,
        {
          method: "POST",
          body: {
            items: items.map(({ item_id, qty }) => ({ item_id, qty })),
            return_url: `${location.origin}/Productos`,
          },
        },
      );
      if (!r?.checkout_url) return { ok: false, error: "No pudimos iniciar la compra. Probá de nuevo." };
      return { ok: true, url: r.checkout_url };
    } catch (e: unknown) {
      const err = e as { data?: { statusMessage?: string }; statusMessage?: string };
      const msg = err?.data?.statusMessage || err?.statusMessage || "";
      return { ok: false, error: msg || "Error de conexión. Probá de nuevo en unos segundos." };
    }
  }

  return { lineas, listo, aviso, cantidad, cargar, agregar, fijar, quitar, vaciar, avisar, resolver, crearCheckout };
}
