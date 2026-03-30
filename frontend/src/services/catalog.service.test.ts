import { describe, it, expect } from "vitest";
import { getCatalog, getCategories } from "./catalog.service";
import { defaultCatalog, defaultCategories } from "@/test/msw/handlers";

describe("catalog.service", () => {
  it("getCatalog returns catalog", async () => {
    const catalog = await getCatalog("loc-1");
    expect(catalog).toEqual(defaultCatalog);
  });

  it("getCategories returns categories", async () => {
    const categories = await getCategories("loc-1");
    expect(categories).toEqual(defaultCategories);
  });
});

