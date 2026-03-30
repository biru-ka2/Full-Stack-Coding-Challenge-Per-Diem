import { http, HttpResponse } from "msw";

const base = "http://localhost:8080/api";

const defaultLocations = [
  {
    id: "loc-1",
    name: "Test Cafe",
    address: "1 Main St",
    timezone: "America/New_York",
    status: "ACTIVE" as const,
  },
];

const defaultCatalog = [
  {
    category: "Beverages",
    items: [
      {
        id: "item-1",
        name: "Cold Brew",
        description: "Iced coffee",
        category: "Beverages",
        image_url: null,
        variations: [],
      },
      {
        id: "item-2",
        name: "Pastry",
        description: "Buttery croissant",
        category: "Beverages",
        image_url: null,
        variations: [],
      },
    ],
  },
];

const defaultCategories = [{ id: "cat-1", name: "Beverages", item_count: 2 }];

export const handlers = [
  http.get(`${base}/locations`, () => HttpResponse.json({ locations: defaultLocations })),
  http.get(`${base}/catalog`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get("location_id")) return HttpResponse.json({ error: "missing" }, { status: 400 });
    return HttpResponse.json({ catalog: defaultCatalog });
  }),
  http.get(`${base}/catalog/categories`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get("location_id")) return HttpResponse.json({ error: "missing" }, { status: 400 });
    return HttpResponse.json({ categories: defaultCategories });
  }),
];

export { defaultLocations, defaultCatalog, defaultCategories };

