import { API_BASE_URL } from "@/lib/config";
import type { CatalogGroup, Category } from "@/types";

export async function getCatalog(locationId: string): Promise<CatalogGroup[]> {
  const res = await fetch(
    `${API_BASE_URL}/catalog?location_id=${locationId}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch catalog");
  const data = await res.json();
  return data.catalog as CatalogGroup[];
}

export async function getCategories(locationId: string): Promise<Category[]> {
  const res = await fetch(
    `${API_BASE_URL}/catalog/categories?location_id=${locationId}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.categories as Category[];
}
