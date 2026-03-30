import { test, expect } from "@playwright/test";
import { installDefaultMockApi } from "./helpers/mock-api";

test.describe("search and category", () => {
  test.beforeEach(async ({ page }) => {
    await installDefaultMockApi(page);
  });

  test("desktop search filters catalog; sidebar category link scrolls to section", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    await page.getByRole("button", { name: "Change location" }).click();
    await page.getByRole("button", { name: /E2E Cafe/i }).click();

    await expect(page.getByRole("heading", { name: "Beverages" })).toBeVisible();

    // Two search inputs exist (desktop header + mobile main). Use the desktop (header) one.
    const search = page.locator("header").getByPlaceholder("Search curated flavors...");
    await search.fill("croissant");

    await expect(page.getByText("Croissant")).toBeVisible();
    await expect(page.getByText("Cold Brew")).not.toBeVisible();

    await search.clear();
    await expect(page.getByText("Cold Brew")).toBeVisible();

    // Click in desktop sidebar.
    await page.locator("aside").getByRole("button", { name: /Beverages/i }).click();
    await expect(page.locator("#category-Beverages")).toBeVisible();
  });
});

