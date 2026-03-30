import { describe, it, expect } from "vitest";
import { getLocations } from "./locations.service";
import { defaultLocations } from "@/test/msw/handlers";

describe("getLocations", () => {
  it("returns locations from API", async () => {
    const locations = await getLocations();
    expect(locations).toEqual(defaultLocations);
  });
});

