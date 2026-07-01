import type { CatalogGroup } from "~/utils/catalog";

// Trae el catálogo (widget) del panel una vez y lo comparte por key 'sms-catalog'
// entre la página de Productos y los headers (nav). Server-side + payload → sin
// refetch en cliente. Fallback a vacío si el endpoint no responde.
export async function useCatalog() {
  const config = useRuntimeConfig();
  const { data } = await useAsyncData("sms-catalog", () =>
    $fetch<{ groups: CatalogGroup[] }>(
      `${config.public.smsApiBase}/api/public/sites/${config.public.smsSiteId}/catalog`,
    ).catch(() => ({ groups: [] as CatalogGroup[] })),
  );
  const groups = computed<CatalogGroup[]>(() => data.value?.groups ?? []);
  return { groups };
}
