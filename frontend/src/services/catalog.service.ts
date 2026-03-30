import { API_BASE_URL } from "@/lib/config";
import type { ApiError, CatalogGroup, Category } from "@/types";

export async function getCatalog(locationId: string): Promise<CatalogGroup[]> {
  const res = await fetch(
    `${API_BASE_URL}/catalog?location_id=${locationId}`,
    { cache: "no-store" }
  );
  const data = (await res.json().catch(() => null)) as { catalog?: CatalogGroup[] } | ApiError | null;
  if (!res.ok) {
    const message = data && "error" in data && data.error ? data.error : "Failed to fetch catalog";
    throw new Error(message);
  }
  return (data && "catalog" in data ? data.catalog : []) as CatalogGroup[];
}

export async function getCategories(locationId: string): Promise<Category[]> {
  const res = await fetch(
    `${API_BASE_URL}/catalog/categories?location_id=${locationId}`,
    { cache: "no-store" }
  );
  const data = (await res.json().catch(() => null)) as { categories?: Category[] } | ApiError | null;
  if (!res.ok) {
    const message = data && "error" in data && data.error ? data.error : "Failed to fetch categories";
    throw new Error(message);
  }
  return (data && "categories" in data ? data.categories : []) as Category[];
}
