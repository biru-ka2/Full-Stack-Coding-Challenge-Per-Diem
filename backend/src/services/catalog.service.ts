import { fetchAllCatalogObjects } from "./square.service";
import * as cache from "./cache.service";
import type {
  CatalogGroup,
  CatalogItemResponse,
  CategorySummary,
  SquareCatalogObject,
  VariationResponse,
} from "../types";

const CACHE_TTL_S = 5 * 60; // 5 minutes

function isPresentAtLocation(obj: SquareCatalogObject, locationId: string): boolean {
  if (obj.present_at_all_locations) return true;
  return Array.isArray(obj.present_at_location_ids) &&
    obj.present_at_location_ids.includes(locationId);
}

export async function getCatalogByLocation(locationId: string): Promise<CatalogGroup[]> {
  const cacheKey = `catalog:${locationId}`;
  const cached = await cache.get<CatalogGroup[]>(cacheKey);
  if (cached) return cached;

  const { objects, related_objects } = await fetchAllCatalogObjects({
    object_types: ["ITEM"],
    include_related_objects: true,
  });

  const categoryMap = new Map<string, string>();
  const imageMap = new Map<string, string>();

  for (const obj of related_objects) {
    if (obj.type === "CATEGORY" && obj.category_data) {
      categoryMap.set(obj.id, obj.category_data.name ?? "Uncategorized");
    }
    if (obj.type === "IMAGE" && obj.image_data?.url) {
      imageMap.set(obj.id, obj.image_data.url);
    }
  }

  const grouped = new Map<string, CatalogItemResponse[]>();

  for (const obj of objects) {
    if (obj.type !== "ITEM" || !obj.item_data) continue;
    if (!isPresentAtLocation(obj, locationId)) continue;

    const item = obj.item_data;
    const categoryId = item.category_id ?? item.categories?.[0]?.id;
    const categoryName = categoryId ? (categoryMap.get(categoryId) ?? "Uncategorized") : "Uncategorized";

    const imageId = item.image_ids?.[0];
    const imageUrl = imageId ? (imageMap.get(imageId) ?? null) : null;

    const variations: VariationResponse[] = (item.variations ?? []).map((v) => ({
      id: v.id,
      name: v.item_variation_data?.name ?? "",
      price: v.item_variation_data?.price_money?.amount ?? null,
    }));

    const shaped: CatalogItemResponse = {
      id: obj.id,
      name: item.name ?? "",
      description: item.description ?? null,
      category: categoryName,
      image_url: imageUrl,
      variations,
    };

    if (!grouped.has(categoryName)) grouped.set(categoryName, []);
    grouped.get(categoryName)!.push(shaped);
  }

  const result: CatalogGroup[] = Array.from(grouped.entries()).map(([category, items]) => ({
    category,
    items,
  }));

  await cache.set(cacheKey, result, CACHE_TTL_S);
  return result;
}

export async function getCategoriesByLocation(locationId: string): Promise<CategorySummary[]> {
  const cacheKey = `categories:${locationId}`;
  const cached = await cache.get<CategorySummary[]>(cacheKey);
  if (cached) return cached;

  const { objects, related_objects } = await fetchAllCatalogObjects({
    object_types: ["ITEM"],
    include_related_objects: true,
  });

  const categoryStats = new Map<string, { id: string; name: string; count: number }>();

  for (const obj of related_objects) {
    if (obj.type === "CATEGORY" && obj.category_data) {
      categoryStats.set(obj.id, { id: obj.id, name: obj.category_data.name ?? "Uncategorized", count: 0 });
    }
  }

  for (const obj of objects) {
    if (obj.type !== "ITEM" || !obj.item_data) continue;
    if (!isPresentAtLocation(obj, locationId)) continue;

    const categoryId = obj.item_data.category_id ?? obj.item_data.categories?.[0]?.id;
    if (categoryId) {
      const stat = categoryStats.get(categoryId);
      if (stat) stat.count += 1;
    }
  }

  const result: CategorySummary[] = Array.from(categoryStats.values())
    .filter((c) => c.count > 0)
    .map((c) => ({ id: c.id, name: c.name, item_count: c.count }));

  await cache.set(cacheKey, result, CACHE_TTL_S);
  return result;
}
