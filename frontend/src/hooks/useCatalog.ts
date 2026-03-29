"use client";

import { useState, useEffect, useCallback } from "react";
import { getCatalog, getCategories } from "@/services/catalog.service";
import type { CatalogGroup, Category } from "@/types";

export function useCatalog(locationId: string | null) {
  const [catalog, setCatalog] = useState<CatalogGroup[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    if (!locationId) return;
    setLoading(true);
    setError(null);
    Promise.all([getCatalog(locationId), getCategories(locationId)])
      .then(([catalogData, categoriesData]) => {
        setCatalog(catalogData);
        setCategories(categoriesData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [locationId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { catalog, categories, loading, error, retry: fetch };
}
