export interface Location {
  id: string;
  name: string;
  address: string | null;
  timezone: string | null;
  status: "ACTIVE" | "INACTIVE";
}

export interface Variation {
  id: string;
  name: string;
  price: number | null;
  currency: string | null;
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  image_url: string | null;
  variations: Variation[];
}

export interface CatalogGroup {
  category: string;
  items: CatalogItem[];
}

export interface Category {
  id: string;
  name: string;
  item_count: number;
}

export interface ApiError {
  error: string;
  code?: string;
}
