import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../services/square.service");
vi.mock("../services/cache.service");

import { getActiveLocations } from "../services/locations.service";
import { fetchLocations } from "../services/square.service";
import * as cache from "../services/cache.service";

describe("getActiveLocations", () => {
  beforeEach(() => {
    vi.mocked(cache.get).mockResolvedValue(null);
    vi.mocked(cache.set).mockResolvedValue(undefined);
    vi.mocked(fetchLocations).mockReset();
  });

  it("returns cached value without calling Square", async () => {
    const cached = [
      {
        id: "cached-1",
        name: "Cached",
        address: null,
        timezone: null,
        status: "ACTIVE" as const,
      },
    ];
    vi.mocked(cache.get).mockResolvedValue(cached);

    const result = await getActiveLocations();

    expect(result).toEqual(cached);
    expect(fetchLocations).not.toHaveBeenCalled();
  });

  it("filters ACTIVE only, maps address, and caches", async () => {
    vi.mocked(fetchLocations).mockResolvedValue([
      {
        id: "a",
        name: "Active Shop",
        status: "ACTIVE",
        timezone: "America/New_York",
        address: {
          address_line_1: "1 Main St",
          locality: "Brooklyn",
          administrative_district_level_1: "NY",
          postal_code: "11201",
        },
      },
      {
        id: "b",
        name: "Closed",
        status: "INACTIVE",
      },
    ]);

    const result = await getActiveLocations();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "a",
      name: "Active Shop",
      timezone: "America/New_York",
      status: "ACTIVE",
      address: "1 Main St, Brooklyn, NY, 11201",
    });
    expect(cache.set).toHaveBeenCalledWith("locations", result, expect.any(Number));
  });
});

