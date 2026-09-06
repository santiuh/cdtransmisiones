import type { CatalogGroup, CatalogResponse } from "~/utils/catalog";
import { aplanar, type TiendaItem } from "~/utils/tienda";

// Trae el catálogo (widget) del panel una vez y lo comparte por key 'sms-catalog'
// entre las páginas de Productos, los headers (nav) y el carrito. Server-side +
// payload → sin refetch en cliente. Fallback a vacío si el endpoint no responde.
// `shopEnabled` = features.ecommerce.enabled del servicio: con la tienda apagada
// el listado sigue andando como vitrina (todo "Consultar").
export async function useCatalog() {
  const config = useRuntimeConfig();
  const { data } = await useAsyncData("sms-catalog", () =>
    $fetch<CatalogResponse>(
      `${config.public.smsApiBase}/api/public/sites/${config.public.smsSiteId}/catalog`,
    ).catch(() => ({ site_id: "", shop_enabled: false, groups: [] as CatalogGroup[] })),
  );
  const groups = computed<CatalogGroup[]>(() => data.value?.groups ?? []);
  const shopEnabled = computed(() => data.value?.shop_enabled === true);
  const items = computed<TiendaItem[]>(() => aplanar(groups.value));
  const porId = computed(() => new Map(items.value.map((i) => [i.id, i])));
  return { groups, shopEnabled, items, porId };
}
