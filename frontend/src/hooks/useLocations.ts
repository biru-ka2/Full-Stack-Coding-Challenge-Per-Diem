"use client";

import { useState, useEffect } from "react";
import { getLocations } from "@/services/locations.service";
import type { Location } from "@/types";

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLocations()
      .then(setLocations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { locations, loading, error };
}
