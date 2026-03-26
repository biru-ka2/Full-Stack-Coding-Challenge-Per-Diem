const { fetchAllCatalogObjects } = require("./square.service");
const cache = require("./cache.service");

/**
 * @typedef {Object} VariationResponse
 * @property {string} id
 * @property {string} name
 * @property {number | null} price  - price in cents
 */

/**
 * @typedef {Object} CatalogItemResponse
 * @property {string} id
 * @property {string} name
 * @property {string | null} description
 * @property {string} category
 * @property {string | null} image_url
 * @property {VariationResponse[]} variations
 */

/**
 * @typedef {Object} CatalogByCategory
 * @property {string} category
 * @property {CatalogItemResponse[]} items
 */

/**
 * @typedef {Object} CategorySummary
 * @property {string} id
 * @property {string} name
 * @property {number} item_count
 */

/**
 * Check if a catalog object is present at a given location.
 * @param {import('./square.service').SquareCatalogObject} obj
 * @param {string} locationId
 * @returns {boolean}
 */
const isPresentAtLocation = (obj, locationId) => {
  if (obj.present_at_all_locations) return true;
  return Array.isArray(obj.present_at_location_ids) &&
    obj.present_at_location_ids.includes(locationId);
};

/**
 * Fetch and process catalog items grouped by category for a location.
 * @param {string} locationId
 * @returns {Promise<CatalogByCategory[]>}
 */
const getCatalogByLocation = async (locationId) => {
  const cacheKey = `catalog:${locationId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const { objects, related_objects } = await fetchAllCatalogObjects({
    object_types: ["ITEM"],
    include_related_objects: true,
  });

  // Build lookup maps from related_objects
  /** @type {Map<string, string>} id -> category name */
  const categoryMap = new Map();
  /** @type {Map<string, string>} id -> image url */
  const imageMap = new Map();

  for (const obj of related_objects) {
    if (obj.type === "CATEGORY" && obj.category_data) {
      categoryMap.set(obj.id, obj.category_data.name || "Uncategorized");
    }
    if (obj.type === "IMAGE" && obj.image_data) {
      imageMap.set(obj.id, obj.image_data.url || null);
    }
  }

  // Filter items present at this location and shape them
  /** @type {Map<string, CatalogItemResponse[]>} */
  const grouped = new Map();

  for (const obj of objects) {
    if (obj.type !== "ITEM" || !obj.item_data) continue;
    if (!isPresentAtLocation(obj, locationId)) continue;

    const item = obj.item_data;

    // Resolve category
    const categoryId = item.category_id || (item.categories && item.categories[0]?.id);
    const categoryName = categoryId ? (categoryMap.get(categoryId) || "Uncategorized") : "Uncategorized";

    // Resolve image
    const imageId = item.image_ids && item.image_ids[0];
    const imageUrl = imageId ? (imageMap.get(imageId) || null) : null;

    // Resolve variations
    /** @type {VariationResponse[]} */
    const variations = (item.variations || []).map((v) => ({
      id: v.id,
      name: v.item_variation_data?.name || "",
      price: v.item_variation_data?.price_money?.amount ?? null,
    }));

    /** @type {CatalogItemResponse} */
    const shaped = {
      id: obj.id,
      name: item.name || "",
      description: item.description || null,
      category: categoryName,
      image_url: imageUrl,
      variations,
    };

    if (!grouped.has(categoryName)) grouped.set(categoryName, []);
    grouped.get(categoryName).push(shaped);
  }

  /** @type {CatalogByCategory[]} */
  const result = Array.from(grouped.entries()).map(([category, items]) => ({
    category,
    items,
  }));

  cache.set(cacheKey, result);
  return result;
};

/**
 * Get categories with item counts for a location.
 * @param {string} locationId
 * @returns {Promise<CategorySummary[]>}
 */
const getCategoriesByLocation = async (locationId) => {
  const cacheKey = `categories:${locationId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const { objects, related_objects } = await fetchAllCatalogObjects({
    object_types: ["ITEM"],
    include_related_objects: true,
  });

  /** @type {Map<string, { id: string, name: string, count: number }>} */
  const categoryStats = new Map();

  // Build category name map
  for (const obj of related_objects) {
    if (obj.type === "CATEGORY" && obj.category_data) {
      categoryStats.set(obj.id, { id: obj.id, name: obj.category_data.name || "Uncategorized", count: 0 });
    }
  }

  for (const obj of objects) {
    if (obj.type !== "ITEM" || !obj.item_data) continue;
    if (!isPresentAtLocation(obj, locationId)) continue;

    const item = obj.item_data;
    const categoryId = item.category_id || (item.categories && item.categories[0]?.id);
    if (categoryId && categoryStats.has(categoryId)) {
      categoryStats.get(categoryId).count += 1;
    }
  }

  /** @type {CategorySummary[]} */
  const result = Array.from(categoryStats.values())
    .filter((c) => c.count > 0)
    .map((c) => ({ id: c.id, name: c.name, item_count: c.count }));

  cache.set(cacheKey, result);
  return result;
};

module.exports = { getCatalogByLocation, getCategoriesByLocation };
