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
  /** null = sin control de stock (el endpoint público lo manda para el carrito). */
  stock?: number | null;
}
export interface CatalogGroup {
  category: CatalogCategory | null;
  items: CatalogItem[];
}

/** Respuesta de GET /api/public/sites/{id}/catalog (widget Catálogo + tienda). */
export interface CatalogResponse {
  site_id: string;
  /** features.ecommerce.enabled del servicio: con esto se prende el carrito. */
  shop_enabled: boolean;
  groups: CatalogGroup[];
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
