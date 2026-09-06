// Lógica PURA de la tienda (listado estilo MercadoLibre + ficha + carrito).
// Sin Vue ni Nuxt acá: todo se testea directo con `npm test` (node:test + tsx).
// La UI vive en components/Tienda/* y pages/Productos/*.
import type { CatalogGroup, CatalogItem } from "./catalog";
import { formatCatalogPrice } from "./catalog";

export const formatPrecio = formatCatalogPrice;

/** URL pública del sitio (canonicals, JSON-LD, texto de consulta por WhatsApp). */
export const SITIO_URL = "https://www.imoberdorfhnos.com.ar";
/** WhatsApp de ventas (mismo número que el footer y el botón flotante). */
export const WHATSAPP_DEFAULT = "5493492573782";
/** Resultados por página del listado (ML pagina; con 38 productos son 3 páginas). */
export const POR_PAGINA = 16;
/** Tope por línea del carrito (SHOP_MAX_QTY_PER_ITEM de la plataforma). */
export const MAX_POR_ITEM = 99;

export interface TiendaItem extends CatalogItem {
  categoria: string | null;
  categoria_id: string | null;
  /** Slug estable de la categoría para la URL (?categoria=motores-electricos). */
  categoria_slug: string | null;
}

export interface TiendaCategoria {
  id: string;
  nombre: string;
  slug: string;
  cantidad: number;
}

export interface RangoPrecio {
  /** Valor del query (?precio=): "-50000" | "50000-150000" | "150000-". */
  valor: string;
  etiqueta: string;
  min: number | null;
  max: number | null;
}

export type Orden = "relevantes" | "menor-precio" | "mayor-precio" | "nombre";
export type Vista = "lista" | "grilla";

export const ORDENES: Array<{ valor: Orden; etiqueta: string }> = [
  { valor: "relevantes", etiqueta: "Más relevantes" },
  { valor: "menor-precio", etiqueta: "Menor precio" },
  { valor: "mayor-precio", etiqueta: "Mayor precio" },
  { valor: "nombre", etiqueta: "Nombre A-Z" },
];

// Marcas diacríticas combinantes (U+0300–U+036F): lo que queda de los acentos
// después de descomponer con NFD.
const DIACRITICOS = new RegExp("[\\u0300-\\u036f]", "g");

// ---------------------------------------------------------------------------
// Texto
// ---------------------------------------------------------------------------

/** Minúsculas sin acentos, para buscar y armar slugs. */
export function normalizar(s: unknown): string {
  return String(s ?? "").normalize("NFD").replace(DIACRITICOS, "").toLowerCase().trim();
}

export function slug(s: unknown): string {
  return normalizar(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Etiquetas de bloque: al pasar a texto plano se reemplazan por un espacio para
// que "…c<p>d</p>" no quede pegado ("c d", no "cd").
const BLOQUES = new RegExp("<\\/?(p|li|div|h[1-6]|ul|ol|tr|td)\\b[^>]*>", "gi");
const SALTOS = new RegExp("<br\\s*\\/?>", "gi");

/** Texto plano a partir del HTML de la descripción (los <br> pasan a espacio). */
export function sinHtml(html: unknown): string {
  return String(html ?? "")
    .replace(SALTOS, " ")
    .replace(BLOQUES, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Corta en un límite de caracteres sin partir palabras, con puntos suspensivos. */
export function resumir(texto: string, max = 160): string {
  const t = texto.trim();
  if (t.length <= max) return t;
  const corte = t.lastIndexOf(" ", max);
  return `${t.slice(0, corte > max * 0.6 ? corte : max).trim()}…`;
}

const PELIGROSAS = new RegExp(
  "<\\s*(script|style|iframe|object|embed|svg)[^>]*>[\\s\\S]*?<\\s*\\/\\s*\\1\\s*>",
  "gi",
);
const COMENTARIOS = new RegExp("<!--[\\s\\S]*?-->", "g");
const ETIQUETAS = new RegExp("<\\/?([a-z][a-z0-9]*)\\b[^>]*>", "gi");

/**
 * Deja pasar solo etiquetas inofensivas de la descripción (viene del panel del
 * cliente, pero igual no se renderiza nada ejecutable ni con atributos).
 */
export function limpiarHtml(html: unknown): string {
  const permitidas = new Set(["br", "p", "b", "strong", "i", "em", "ul", "ol", "li"]);
  return String(html ?? "")
    .replace(PELIGROSAS, "")
    .replace(COMENTARIOS, "")
    .replace(ETIQUETAS, (etiqueta: string, nombre: string) => {
      const n = nombre.toLowerCase();
      if (!permitidas.has(n)) return "";
      if (n === "br") return "<br>";
      return etiqueta.startsWith("</") ? `</${n}>` : `<${n}>`;
    })
    .trim();
}

// ---------------------------------------------------------------------------
// Catálogo aplanado + categorías
// ---------------------------------------------------------------------------

/** Aplana los grupos del endpoint en items con su categoría y un slug único. */
export function aplanar(groups: CatalogGroup[]): TiendaItem[] {
  const usados = new Set<string>();
  const out: TiendaItem[] = [];
  for (const g of groups) {
    let s: string | null = null;
    if (g.category) {
      const base = slug(g.category.name) || "categoria";
      s = base;
      let n = 2;
      while (usados.has(s)) s = `${base}-${n++}`;
      usados.add(s);
    }
    for (const it of g.items) {
      out.push({
        ...it,
        categoria: g.category?.name ?? null,
        categoria_id: g.category?.id ?? null,
        categoria_slug: s,
      });
    }
  }
  return out;
}

/** Categorías presentes en `items` (en orden de aparición) con su conteo. */
export function categorias(items: TiendaItem[]): TiendaCategoria[] {
  const map = new Map<string, TiendaCategoria>();
  for (const it of items) {
    if (!it.categoria_id || !it.categoria_slug || !it.categoria) continue;
    const c = map.get(it.categoria_slug);
    if (c) c.cantidad++;
    else map.set(it.categoria_slug, { id: it.categoria_id, nombre: it.categoria, slug: it.categoria_slug, cantidad: 1 });
  }
  return [...map.values()];
}

export function filtrarCategoria(items: TiendaItem[], categoriaSlug: string | null): TiendaItem[] {
  if (!categoriaSlug) return items;
  return items.filter((i) => i.categoria_slug === categoriaSlug);
}

// ---------------------------------------------------------------------------
// Búsqueda
// ---------------------------------------------------------------------------

export function tokens(q: unknown): string[] {
  return normalizar(q)
    .split(/\s+/)
    .filter((t) => t.length >= 2 || /^\d$/.test(t));
}

/**
 * Puntaje de un item para una búsqueda: 0 si algún término no aparece en
 * nombre/categoría/descripción; más alto cuanto más arriba matchea.
 */
export function puntaje(item: TiendaItem, toks: string[]): number {
  if (!toks.length) return 0;
  const nombre = normalizar(item.name);
  const cat = normalizar(item.categoria);
  const desc = normalizar(sinHtml(item.description));
  let total = 0;
  for (const t of toks) {
    if (nombre.includes(t)) total += nombre.startsWith(t) ? 5 : 3;
    else if (cat.includes(t)) total += 2;
    else if (desc.includes(t)) total += 1;
    else return 0;
  }
  return total;
}

export function buscar(items: TiendaItem[], q: unknown): TiendaItem[] {
  const toks = tokens(q);
  if (!toks.length) return items;
  return items.filter((i) => puntaje(i, toks) > 0);
}

// ---------------------------------------------------------------------------
// Precio
// ---------------------------------------------------------------------------

/** Redondea a un número "lindo" (2 cifras significativas en pasos de 0,5). */
export function redondearLindo(n: number): number {
  if (!(n > 0)) return 0;
  const mag = 10 ** Math.floor(Math.log10(n));
  return (Math.round((n / mag) * 2) / 2) * mag;
}

/**
 * Tres rangos de precio a lo MercadoLibre ("Hasta $X", "$X a $Y", "Más de $Y")
 * a partir de los terciles de los precios cargados. Con menos de 4 productos
 * con precio no tiene sentido y devuelve [].
 */
export function rangosDePrecio(items: TiendaItem[]): RangoPrecio[] {
  const precios = items
    .map((i) => i.price_ars)
    .filter((p): p is number => p != null && Number.isFinite(p))
    .sort((a, b) => a - b);
  if (precios.length < 4) return [];
  const cuantil = (f: number) => precios[Math.min(precios.length - 1, Math.floor(f * precios.length))] as number;
  const a = redondearLindo(cuantil(1 / 3));
  const b = redondearLindo(cuantil(2 / 3));
  if (!(a > 0 && b > a)) return [];
  return [
    { valor: `-${a}`, etiqueta: `Hasta ${formatPrecio(a)}`, min: null, max: a },
    { valor: `${a}-${b}`, etiqueta: `${formatPrecio(a)} a ${formatPrecio(b)}`, min: a, max: b },
    { valor: `${b}-`, etiqueta: `Más de ${formatPrecio(b)}`, min: b, max: null },
  ];
}

/** Parsea ?precio= ("-50000" | "50000-150000" | "150000-"); null si no aplica. */
export function parsePrecio(v: unknown): { min: number | null; max: number | null } | null {
  if (typeof v !== "string") return null;
  const m = /^(\d*)-(\d*)$/.exec(v.trim());
  if (!m) return null;
  const min = m[1] ? Number(m[1]) : null;
  const max = m[2] ? Number(m[2]) : null;
  if (min == null && max == null) return null;
  if (min != null && max != null && min > max) return null;
  return { min, max };
}

/** Con un filtro de precio activo, los productos "a consultar" quedan afuera. */
export function filtrarPrecio(items: TiendaItem[], min: number | null, max: number | null): TiendaItem[] {
  if (min == null && max == null) return items;
  return items.filter((i) => {
    const p = i.price_ars;
    if (p == null) return false;
    if (min != null && p < min) return false;
    if (max != null && p > max) return false;
    return true;
  });
}

// ---------------------------------------------------------------------------
// Orden + paginación
// ---------------------------------------------------------------------------

export function parseOrden(v: unknown): Orden {
  return ORDENES.some((o) => o.valor === v) ? (v as Orden) : "relevantes";
}

/** La grilla (4 columnas, como ML) es la vista por defecto; ?vista=lista es la alternativa. */
export function parseVista(v: unknown): Vista {
  return v === "lista" ? "lista" : "grilla";
}

export function parsePagina(v: unknown): number {
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

export function ordenar(items: TiendaItem[], orden: Orden, q: unknown = ""): TiendaItem[] {
  const arr = [...items];
  const porPosicion = (a: TiendaItem, b: TiendaItem) =>
    a.position - b.position || a.name.localeCompare(b.name, "es");
  switch (orden) {
    case "menor-precio":
      return arr.sort(
        (a, b) =>
          (a.price_ars ?? Number.POSITIVE_INFINITY) - (b.price_ars ?? Number.POSITIVE_INFINITY) ||
          porPosicion(a, b),
      );
    case "mayor-precio":
      return arr.sort(
        (a, b) =>
          (b.price_ars ?? Number.NEGATIVE_INFINITY) - (a.price_ars ?? Number.NEGATIVE_INFINITY) ||
          porPosicion(a, b),
      );
    case "nombre":
      return arr.sort((a, b) => a.name.localeCompare(b.name, "es"));
    default: {
      const toks = tokens(q);
      return arr.sort(
        (a, b) =>
          puntaje(b, toks) - puntaje(a, toks) ||
          Number(b.featured) - Number(a.featured) ||
          porPosicion(a, b),
      );
    }
  }
}

export interface Pagina<T> {
  items: T[];
  pagina: number;
  paginas: number;
  total: number;
  desde: number;
  hasta: number;
}

export function paginar<T>(items: T[], pagina: number, porPagina = POR_PAGINA): Pagina<T> {
  const total = items.length;
  const paginas = Math.max(1, Math.ceil(total / porPagina));
  const p = Math.min(Math.max(1, pagina), paginas);
  const desde = (p - 1) * porPagina;
  return {
    items: items.slice(desde, desde + porPagina),
    pagina: p,
    paginas,
    total,
    desde: total ? desde + 1 : 0,
    hasta: Math.min(total, desde + porPagina),
  };
}

/** Páginas a mostrar en el paginador: 1 … n-1 n n+1 … total. */
export function rangoPaginas(actual: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const nums = [...new Set([1, total, actual - 1, actual, actual + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const out: Array<number | "…"> = [];
  nums.forEach((n, i) => {
    const prev = nums[i - 1];
    if (i > 0 && prev != null && n - prev > 1) out.push("…");
    out.push(n);
  });
  return out;
}

const CLAVES_QUERY = ["q", "categoria", "precio", "compra", "orden", "vista", "pagina"] as const;

/**
 * Arma el query del listado a partir del actual + cambios. Un valor null/""
 * borra la clave. Cualquier cambio que NO sea de página vuelve a la página 1.
 */
export function armarQuery(
  actual: Record<string, unknown>,
  cambios: Record<string, string | number | null | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of CLAVES_QUERY) {
    const v = actual[k];
    if (typeof v === "string" && v) out[k] = v;
  }
  if (!("pagina" in cambios)) delete out.pagina;
  for (const [k, v] of Object.entries(cambios)) {
    if (v == null || v === "") delete out[k];
    else out[k] = String(v);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Compra
// ---------------------------------------------------------------------------

export type EstadoStock = "sin-control" | "disponible" | "agotado";

export function estadoStock(item: Pick<CatalogItem, "stock">): EstadoStock {
  if (item.stock == null) return "sin-control";
  return item.stock > 0 ? "disponible" : "agotado";
}

/** Se puede meter al carrito: tienda ON + precio cargado + stock (si se controla). */
export function puedeComprar(
  item: Pick<CatalogItem, "price_ars" | "stock" | "active">,
  shopEnabled: boolean,
): boolean {
  if (!shopEnabled || item.active === false) return false;
  if (item.price_ars == null) return false;
  return estadoStock(item) !== "agotado";
}

/** Tope de unidades para un item (stock si se controla, si no el máximo del carrito). */
export function maximoUnidades(item: Pick<CatalogItem, "stock">): number {
  return item.stock == null ? MAX_POR_ITEM : Math.max(0, Math.min(MAX_POR_ITEM, item.stock));
}

// ---------------------------------------------------------------------------
// WhatsApp
// ---------------------------------------------------------------------------

/** Normaliza un teléfono cargado a mano al formato de wa.me (549 + área + número). */
export function whatsappNumero(raw: unknown): string {
  let d = String(raw ?? "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("54")) return d.length >= 12 ? d : "";
  if (d.startsWith("0")) d = d.slice(1);
  return d.length >= 10 && d.length <= 11 ? `549${d}` : "";
}

export function whatsappUrl(numero: string, texto: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

/** Mensaje pre-cargado para consultar por un producto puntual. */
export function consultaProducto(nombre: string, url: string): string {
  return `Hola, quiero consultar por "${nombre}" (${url}).`;
}
