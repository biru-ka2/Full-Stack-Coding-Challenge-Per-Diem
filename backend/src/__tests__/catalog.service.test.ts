import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

vi.mock("../services/square.service");
vi.mock("../services/cache.service");

import { getCatalogByLocation, getCategoriesByLocation } from "../services/catalog.service";
import { fetchAllCatalogObjects } from "../services/square.service";
import * as cache from "../services/cache.service";
import type { CatalogFetchResult } from "../services/square.service";

const fixture: CatalogFetchResult = JSON.parse(
  readFileSync(join(process.cwd(), "test/fixtures/square-catalog.json"), "utf8")
);

describe("getCatalogByLocation", () => {
  beforeEach(() => {
    vi.mocked(cache.get).mockResolvedValue(null);
    vi.mocked(cache.set).mockResolvedValue(undefined);
    vi.mocked(fetchAllCatalogObjects).mockResolvedValue(fixture);
  });

  it("includes only items present at location or all locations", async () => {
    const groups = await getCatalogByLocation("LOC_1");
    const allNames = groups.flatMap((g) => g.items.map((i) => i.name));
    expect(allNames).toContain("Cold Brew");
    expect(allNames).toContain("Uncategorized Snack");
    expect(allNames).not.toContain("Wrong Location Item");
  });

  it("maps category names, image URL, and variations", async () => {
    const groups = await getCatalogByLocation("LOC_1");
    const bev = groups.find((g) => g.category === "Beverages");
    expect(bev?.items).toHaveLength(1);
    const item = bev!.items[0];
    expect(item.name).toBe("Cold Brew");
    expect(item.description).toBe("Smooth coffee");
    expect(item.image_url).toBe("https://example.com/cold-brew.jpg");
    expect(item.variations).toEqual([{ id: "VAR_1", name: "Regular", price: 450, currency: "USD" }]);
  });

  it("returns cached catalog when present", async () => {
    const cached = [{ category: "X", items: [] }];
    vi.mocked(fetchAllCatalogObjects).mockClear();
    vi.mocked(cache.get).mockImplementation(async (key: string) => {
      if (key === "catalog:LOC_1") return cached;
      return null;
    });
    const result = await getCatalogByLocation("LOC_1");
    expect(result).toEqual(cached);
    expect(fetchAllCatalogObjects).not.toHaveBeenCalled();
  });

  it("shares a cached catalog snapshot between catalog and categories", async () => {
    const store = new Map<string, unknown>();
    vi.mocked(cache.get).mockImplementation(async (key: string) => (store.get(key) as any) ?? null);
    vi.mocked(cache.set).mockImplementation(async (key: string, value: unknown) => {
      store.set(key, value);
    });
    vi.mocked(fetchAllCatalogObjects).mockClear();

    await getCatalogByLocation("LOC_1");
    await getCategoriesByLocation("LOC_1");

    expect(fetchAllCatalogObjects).toHaveBeenCalledTimes(1);
    expect(store.has("catalog_snapshot:LOC_1")).toBe(true);
  });
});

describe("getCategoriesByLocation", () => {
  beforeEach(() => {
    vi.mocked(cache.get).mockResolvedValue(null);
    vi.mocked(cache.set).mockResolvedValue(undefined);
    vi.mocked(fetchAllCatalogObjects).mockResolvedValue(fixture);
  });

  it("returns categories with item counts for location", async () => {
    const categories = await getCategoriesByLocation("LOC_1");
    const bev = categories.find((c) => c.name === "Beverages");
    expect(bev).toMatchObject({ id: "CAT_BEV", name: "Beverages", item_count: 1 });
  });
});

