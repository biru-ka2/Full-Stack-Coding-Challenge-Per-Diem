import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../services/square.service", () => ({
  fetchLocations: vi.fn(),
  fetchAllCatalogObjects: vi.fn(),
}));

vi.mock("../services/cache.service", () => ({
  get: vi.fn().mockResolvedValue(null),
  set: vi.fn().mockResolvedValue(undefined),
  del: vi.fn().mockResolvedValue(undefined),
}));

import { app } from "../app";
import * as squareService from "../services/square.service";
import { AppError } from "../utils/errors";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { CatalogFetchResult } from "../services/square.service";

const catalogFixture: CatalogFetchResult = JSON.parse(
  readFileSync(join(process.cwd(), "test/fixtures/square-catalog.json"), "utf8")
);

describe("HTTP app", () => {
  beforeEach(() => {
    vi.mocked(squareService.fetchLocations).mockReset();
    vi.mocked(squareService.fetchAllCatalogObjects).mockReset();
    vi.mocked(squareService.fetchLocations).mockResolvedValue([
      { id: "LOC_1", name: "Test Cafe", status: "ACTIVE" },
    ]);
    vi.mocked(squareService.fetchAllCatalogObjects).mockResolvedValue(catalogFixture);
  });

  it("GET /ping returns pong", async () => {
    const res = await request(app).get("/ping").expect(200);
    expect(res.body).toEqual({ pong: true });
  });

  it("GET /api/health returns ok payload", async () => {
    const res = await request(app).get("/api/health").expect(200);
    expect(res.body.status).toBe("ok");
  });

  it("GET /api/catalog without location_id returns 422", async () => {
    const res = await request(app).get("/api/catalog").expect(422);
    expect(res.body.error).toContain("location_id");
    expect(res.body.code).toBe("VALIDATION_ERROR");
  });

  it("maps AppError to response status", async () => {
    vi.mocked(squareService.fetchAllCatalogObjects).mockRejectedValue(
      new AppError("Square unavailable", 502, "UPSTREAM_UNAVAILABLE")
    );
    const res = await request(app).get("/api/catalog?location_id=LOC_1").expect(502);
    expect(res.body.error).toBe("Square unavailable");
    expect(res.body.code).toBe("UPSTREAM_UNAVAILABLE");
  });

  it("GET /api/does-not-exist returns 404 with code", async () => {
    const res = await request(app).get("/api/does-not-exist").expect(404);
    expect(res.body.error).toContain("not found");
    expect(res.body.code).toBe("NOT_FOUND");
  });
});

