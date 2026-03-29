import { fetchLocations } from "./square.service";
import * as cache from "./cache.service";
import type { LocationResponse } from "../types";

const CACHE_KEY = "locations";
const CACHE_TTL_S = 10 * 60; // 10 minutes — locations rarely change

export async function getActiveLocations(): Promise<LocationResponse[]> {
  const cached = await cache.get<LocationResponse[]>(CACHE_KEY);
  if (cached) return cached;

  const raw = await fetchLocations();

  const result: LocationResponse[] = raw
    .filter((loc) => loc.status === "ACTIVE")
    .map((loc) => ({
      id: loc.id,
      name: loc.name,
      address: loc.address
        ? [
            loc.address.address_line_1,
            loc.address.locality,
            loc.address.administrative_district_level_1,
            loc.address.postal_code,
          ]
            .filter(Boolean)
            .join(", ")
        : null,
      timezone: loc.timezone ?? null,
      status: loc.status,
    }));

  await cache.set(CACHE_KEY, result, CACHE_TTL_S);
  return result;
}
