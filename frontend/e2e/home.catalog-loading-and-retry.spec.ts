import { test, expect } from "@playwright/test";
import { mockCatalog, mockCategories, mockLocations } from "./helpers/mock-api";

test.describe("catalog error and retry", () => {
  test("shows connection lost then succeeds on retry", async ({ page }) => {
    let failingCalls = 0;

    await page.route("http://127.0.0.1:9999/api/**", async (route) => {
      const url = new URL(route.request().url());
      const path = url.pathname;

      if (path.endsWith("/locations")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ locations: mockLocations }),
        });
        return;
      }

      if (path.endsWith("/catalog/categories") || path.endsWith("/catalog")) {
        failingCalls += 1;
        // First load does two requests (catalog + categories) -> fail both.
        if (failingCalls <= 2) {
          await route.fulfill({ status: 503, contentType: "application/json", body: "{}" });
          return;
        }

        if (path.endsWith("/catalog/categories")) {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ categories: mockCategories }),
          });
          return;
        }

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ catalog: mockCatalog }),
        });
        return;
      }

      await route.fulfill({ status: 404, body: "{}" });
    });

    await page.goto("/");

    await page.getByRole("button", { name: "Change location" }).click();
    await page.getByRole("button", { name: /E2E Cafe/i }).click();

    await expect(page.getByRole("heading", { name: "Connection lost" })).toBeVisible();
    await expect(page.getByText("Our kitchen is momentarily disconnected.")).toBeVisible();

    await page.getByRole("button", { name: "Retry Connection" }).click();

    await expect(page.getByRole("heading", { name: "Beverages" })).toBeVisible();
    await expect(page.getByText("Cold Brew")).toBeVisible();
  });
});

