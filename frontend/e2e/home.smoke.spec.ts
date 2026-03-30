import { test, expect } from "@playwright/test";
import { installDefaultMockApi, mockLocations } from "./helpers/mock-api";

test.beforeEach(async ({ page }) => {
  await installDefaultMockApi(page);
});

test("select location renders catalog", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Choose your location")).toBeVisible();

  await page.getByRole("button", { name: "Change location" }).click();
  await page.getByRole("button", { name: new RegExp(mockLocations[0].name, "i") }).click();

  await expect(page.getByRole("heading", { name: "Beverages" })).toBeVisible();
  await expect(page.getByText("Cold Brew")).toBeVisible();
});

