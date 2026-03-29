// ── API response shapes ──────────────────────────────────────────────

export interface LocationResponse {
  id: string;
  name: string;
  address: string | null;
  timezone: string | null;
  status: "ACTIVE" | "INACTIVE";
}

export interface VariationResponse {
  id: string;
  name: string;
  price: number | null; // cents
}

export interface CatalogItemResponse {
  id: string;
  name: string;
  description: string | null;
  category: string;
  image_url: string | null;
  variations: VariationResponse[];
}

export interface CatalogGroup {
  category: string;
  items: CatalogItemResponse[];
}

export interface CategorySummary {
  id: string;
  name: string;
  item_count: number;
}

export interface HealthResponse {
  status: "ok";
  timestamp: string;
  uptime: number;
}

export interface ApiErrorResponse {
  error: string;
  code?: string;
}

// ── Square API raw shapes ────────────────────────────────────────────

export interface SquareAddress {
  address_line_1?: string;
  locality?: string;
  administrative_district_level_1?: string;
  postal_code?: string;
}

export interface SquareLocation {
  id: string;
  name: string;
  address?: SquareAddress;
  timezone?: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface SquareMoney {
  amount: number;
  currency: string;
}

export interface SquareItemVariationData {
  name?: string;
  price_money?: SquareMoney;
}

export interface SquareCatalogVariation {
  id: string;
  type: "ITEM_VARIATION";
  item_variation_data?: SquareItemVariationData;
}

export interface SquareCategoryRef {
  id: string;
}

export interface SquareItemData {
  name?: string;
  description?: string;
  category_id?: string;
  categories?: SquareCategoryRef[];
  image_ids?: string[];
  variations?: SquareCatalogVariation[];
}

export interface SquareCategoryData {
  name?: string;
}

export interface SquareImageData {
  url?: string;
}

export interface SquareCatalogObject {
  id: string;
  type: string;
  present_at_all_locations?: boolean;
  present_at_location_ids?: string[];
  item_data?: SquareItemData;
  category_data?: SquareCategoryData;
  image_data?: SquareImageData;
}

export interface SquareError {
  category: string;
  code: string;
  detail?: string;
}
