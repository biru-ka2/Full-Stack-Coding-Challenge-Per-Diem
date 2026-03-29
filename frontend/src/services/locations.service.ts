import { API_BASE_URL } from "@/lib/config";
import type { Location } from "@/types";

export async function getLocations(): Promise<Location[]> {
  const res = await fetch(`${API_BASE_URL}/locations`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch locations");
  const data = await res.json();
  return data.locations as Location[];
}
