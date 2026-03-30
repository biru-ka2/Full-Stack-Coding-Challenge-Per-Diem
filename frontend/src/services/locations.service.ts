import { API_BASE_URL } from "@/lib/config";
import type { ApiError, Location } from "@/types";

export async function getLocations(): Promise<Location[]> {
  const res = await fetch(`${API_BASE_URL}/locations`, { cache: "no-store" });
  const data = (await res.json().catch(() => null)) as { locations?: Location[] } | ApiError | null;
  if (!res.ok) {
    const message = data && "error" in data && data.error ? data.error : "Failed to fetch locations";
    throw new Error(message);
  }
  return (data && "locations" in data ? data.locations : []) as Location[];
}
