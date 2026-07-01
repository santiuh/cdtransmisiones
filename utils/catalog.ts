export interface CatalogCategory {
  id: string;
  name: string;
  position: number;
  active: boolean;
}
export interface CatalogItem {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price_ars: number | null;
  photo_url: string | null;
  position: number;
  featured: boolean;
  active: boolean;
}
export interface CatalogGroup {
  category: CatalogCategory | null;
  items: CatalogItem[];
}

// Formato de precio del catálogo (igual criterio que la plataforma):
// $ es-AR sin decimales, o "Consultar" cuando el precio es null.
export function formatCatalogPrice(priceArs: number | null | undefined): string {
  if (priceArs == null) return "Consultar";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(priceArs));
}
