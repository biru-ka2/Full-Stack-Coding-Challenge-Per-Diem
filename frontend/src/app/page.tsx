"use client";

import { useState } from "react";
import { LocationSelector } from "@/components/locations/LocationSelector";
import { CatalogView } from "@/components/catalog/CatalogView";
import { Spinner } from "@/components/ui/Spinner";
import { useLocations } from "@/hooks/useLocations";
import { useCatalog } from "@/hooks/useCatalog";

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const { locations, loading: locLoading, error: locError } = useLocations();
  const { catalog, categories, loading: catLoading, error: catError } = useCatalog(selectedLocation);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Per Diem Menu</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Select a location to browse the menu
          </p>
        </div>

        {locLoading && <Spinner />}
        {locError && (
          <p className="text-red-500 text-sm">Error: {locError}</p>
        )}

        {!locLoading && !locError && (
          <LocationSelector
            locations={locations}
            selected={selectedLocation}
            onChange={setSelectedLocation}
          />
        )}

        {selectedLocation && (
          <>
            {catLoading && <Spinner />}
            {catError && (
              <p className="text-red-500 text-sm">Error: {catError}</p>
            )}
            {!catLoading && !catError && (
              <CatalogView catalog={catalog} categories={categories} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
