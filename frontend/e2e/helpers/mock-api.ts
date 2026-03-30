import type { Page } from "@playwright/test";

export const mockLocations = [
  {
    id: "e2e-loc-1",
    name: "E2E Cafe",
    address: "100 Test St",
    timezone: "America/New_York",
    status: "ACTIVE" as const,
  },
];

export const mockCatalog = [
  {
    category: "Beverages",
    items: [
      {
        id: "e2e-item-1",
        name: "Cold Brew",
        description: "Smooth iced coffee",
        category: "Beverages",
        image_url: null,
        variations: [{ id: "v1", name: "Regular", price: 400 }],
      },
      {
        id: "e2e-item-2",
        name: "Croissant",
        description: "Buttery pastry",
        category: "Beverages",
        image_url: null,
        variations: [],
      },
    ],
  },
];

export const mockCategories = [{ id: "e2e-cat-1", name: "Beverages", item_count: 2 }];

const json = (status: number, body: unknown) => ({
  status,
  contentType: "application/json",
  body: JSON.stringify(body),
});

export async function installDefaultMockApi(page: Page): Promise<void> {
  await page.route("http://127.0.0.1:9999/api/**", async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;

    if (path.endsWith("/locations")) {
      await route.fulfill(json(200, { locations: mockLocations }));
      return;
    }

    if (path.endsWith("/catalog/categories")) {
      if (!url.searchParams.get("location_id")) {
        await route.fulfill(json(400, { error: "missing location_id" }));
        return;
      }
      await route.fulfill(json(200, { categories: mockCategories }));
      return;
    }

    if (path.endsWith("/catalog")) {
      if (!url.searchParams.get("location_id")) {
        await route.fulfill(json(400, { error: "missing location_id" }));
        return;
      }
      await route.fulfill(json(200, { catalog: mockCatalog }));
      return;
    }

    await route.fulfill(json(404, { error: "unhandled e2e route" }));
  });
}

