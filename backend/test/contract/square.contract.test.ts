import { describe, it, expect } from "vitest";
import request from "supertest";

const enabled =
  process.env.RUN_SQUARE_CONTRACT === "1" && Boolean(process.env.SQUARE_ACCESS_TOKEN?.trim());

/**
 * Hits real Square sandbox. Run: `npm run test:contract` from backend with `.env` set.
 * Skipped unless RUN_SQUARE_CONTRACT=1 and SQUARE_ACCESS_TOKEN is non-empty.
 */
describe.skipIf(!enabled)("Square sandbox contract", () => {
  it("GET /api/locations returns at least one location", async () => {
    const { app } = await import("../../src/app");
    const res = await request(app).get("/api/locations").expect(200);
    expect(Array.isArray(res.body.locations)).toBe(true);
    expect(res.body.locations.length).toBeGreaterThan(0);
  });

  it("GET /api/catalog?location_id=… returns a catalog array", async () => {
    const { app } = await import("../../src/app");
    const locRes = await request(app).get("/api/locations").expect(200);
    const id = locRes.body.locations[0].id as string;
    const res = await request(app)
      .get("/api/catalog")
      .query({ location_id: id })
      .expect(200);
    expect(Array.isArray(res.body.catalog)).toBe(true);
  });

  it("GET /api/catalog/categories?location_id=… returns categories", async () => {
    const { app } = await import("../../src/app");
    const locRes = await request(app).get("/api/locations").expect(200);
    const id = locRes.body.locations[0].id as string;
    const res = await request(app)
      .get("/api/catalog/categories")
      .query({ location_id: id })
      .expect(200);
    expect(Array.isArray(res.body.categories)).toBe(true);
  });
});
