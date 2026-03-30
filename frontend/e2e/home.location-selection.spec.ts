import { test, expect } from "@playwright/test";
import { installDefaultMockApi, mockLocations } from "./helpers/mock-api";

test.describe("location selection", () => {
  test.beforeEach(async ({ page }) => {
    await installDefaultMockApi(page);
  });

  test("choose location, catalog loads, reload keeps selection", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Choose your location")).toBeVisible();

    await page.getByRole("button", { name: "Change location" }).click();
    await page.getByRole("button", { name: new RegExp(mockLocations[0].name, "i") }).click();

    await expect(page.getByRole("heading", { name: "Beverages" })).toBeVisible();
    await expect(page.getByText("Cold Brew")).toBeVisible();

    await page.reload();

    await expect(page.getByText(mockLocations[0].name).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Beverages" })).toBeVisible();

    const stored = await page.evaluate(() => localStorage.getItem("selectedLocationId"));
    expect(stored).toBe(mockLocations[0].id);
  });
});

