"use client";

import { useState, useEffect } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonGrid, SkeletonCategoryTabs } from "@/components/ui/Skeleton";
import { useLocations } from "@/hooks/useLocations";
import { useCatalog } from "@/hooks/useCatalog";
import type { Location } from "@/types";

const STORAGE_KEY = "selectedLocationId";

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { locations, loading: locLoading, error: locError, retry: retryLoc } = useLocations();
  const { catalog, categories, loading: catLoading, error: catError, retry: retryCat } = useCatalog(selectedLocation);

  const selectedLoc: Location | undefined = locations.find((l) => l.id === selectedLocation);

  useEffect(() => {
    if (locations.length === 0) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && locations.some((l) => l.id === saved)) {
      setSelectedLocation(saved);
    }
  }, [locations]);

  function handleLocationChange(id: string) {
    setSelectedLocation(id);
    setSearchQuery("");
    localStorage.setItem(STORAGE_KEY, id);
    setLocationPickerOpen(false);
  }

  return (
    <div className="bg-[#fff4f0] text-[#4b240a] font-[Manrope] min-h-screen">

      {/* ── Header ── */}
      <header className="fixed top-0 w-full z-50 bg-[#fff4f0]/90 backdrop-blur-md border-b border-[#dd9f7c]/20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">

          {/* Brand (desktop) */}
          <h1 className="font-[Epilogue] font-black text-[#a33800] italic text-xl tracking-tight hidden lg:block flex-shrink-0">
            Per Diem
          </h1>
          <div className="hidden lg:block w-px h-6 bg-[#dd9f7c]/40 flex-shrink-0" />

          {/* Location picker trigger */}
          <button
            className="flex items-center gap-2 flex-shrink-0"
            onClick={() => setLocationPickerOpen(!locationPickerOpen)}
            aria-label="Change location"
          >
            <span className="material-symbols-outlined text-[#a33800] text-[20px]">location_on</span>
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-[Manrope] uppercase tracking-widest text-[#805032] leading-none">
                {locLoading ? "Loading..." : "Dining at"}
              </span>
              <div className="flex items-center gap-0.5">
                <span className="font-[Epilogue] font-bold text-sm text-[#a33800] leading-none">
                  {selectedLoc ? selectedLoc.name : locError ? "Error" : "Select location"}
                </span>
                <span className="material-symbols-outlined text-[14px] text-[#a33800]">expand_more</span>
              </div>
            </div>
          </button>

          {/* Search bar — inline on desktop, full-width on mobile when catalog loaded */}
          {selectedLocation && !catLoading && !catError && (
            <div className="relative group flex-1 max-w-xl hidden md:block">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[18px] text-[#805032] group-focus-within:text-[#a33800] transition-colors">search</span>
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search curated flavors..."
                className="w-full h-10 pl-10 pr-9 bg-white rounded-xl border border-[#dd9f7c]/30 focus:outline-none focus:ring-2 focus:ring-[#a33800]/20 font-[Manrope] text-sm placeholder:text-[#805032]/50 text-[#4b240a]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-3 flex items-center text-[#805032] hover:text-[#a33800] transition-colors"
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>
          )}

          <div className="ml-auto flex items-center gap-3">
            <button className="hover:opacity-70 transition-opacity" aria-label="Account">
              <span className="material-symbols-outlined text-[#a33800]">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Location Picker Dropdown */}
      {locationPickerOpen && (
        <div className="fixed top-[68px] left-4 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-[#dd9f7c]/30 overflow-hidden">
          {locLoading && (
            <div className="p-4 space-y-2 animate-pulse">
              {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-[#ffe3d4] rounded-lg" />)}
            </div>
          )}
          {locError && (
            <div className="p-4 text-center">
              <p className="text-sm text-[#b31b25] mb-3">Failed to load locations</p>
              <button onClick={retryLoc} className="px-4 py-2 bg-[#a33800] text-white text-sm font-bold rounded-full">
                Retry
              </button>
            </div>
          )}
          {!locLoading && !locError && locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleLocationChange(loc.id)}
              className={`w-full text-left px-5 py-3.5 flex items-center gap-3 hover:bg-[#ffede5] transition-colors ${selectedLocation === loc.id ? "bg-[#ffede5]" : ""}`}
            >
              <span className={`material-symbols-outlined text-base ${selectedLocation === loc.id ? "text-[#a33800]" : "text-[#805032]"}`}>
                {selectedLocation === loc.id ? "radio_button_checked" : "radio_button_unchecked"}
              </span>
              <div>
                <p className="font-[Epilogue] font-bold text-sm text-[#4b240a]">{loc.name}</p>
                {loc.address && <p className="text-xs text-[#805032]">{loc.address}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
      {locationPickerOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setLocationPickerOpen(false)} />
      )}

      {/* ── Body ── */}
      <div className="pt-16 max-w-6xl mx-auto px-4">

        {/* No location selected */}
        {!selectedLocation && !locLoading && !locError && (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <span className="material-symbols-outlined text-7xl text-[#dd9f7c] mb-5">restaurant_menu</span>
            <h2 className="font-[Epilogue] font-bold text-2xl text-[#4b240a] mb-2">Choose your location</h2>
            <p className="text-sm text-[#805032]">Tap the location in the header to get started.</p>
          </div>
        )}

        {selectedLocation && (
          <div className="lg:flex lg:gap-8">

            {/* ── Desktop Sidebar ── */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24 space-y-6 py-6">
                {/* Location card */}
                <div className="bg-white rounded-2xl p-4 border border-[#dd9f7c]/20 shadow-sm">
                  <p className="text-[9px] font-[Manrope] uppercase tracking-widest text-[#805032] mb-1">Currently viewing</p>
                  <p className="font-[Epilogue] font-bold text-[#4b240a] text-sm leading-snug">{selectedLoc?.name}</p>
                  {selectedLoc?.address && (
                    <p className="text-xs text-[#805032] mt-0.5 leading-snug">{selectedLoc.address}</p>
                  )}
                  <button
                    onClick={() => setLocationPickerOpen(true)}
                    className="mt-3 text-xs text-[#a33800] font-bold hover:underline"
                  >
                    Change location
                  </button>
                </div>

                {/* Category list */}
                {!catLoading && !catError && categories.length > 0 && (
                  <div>
                    <p className="text-[9px] font-[Manrope] uppercase tracking-widest text-[#805032] mb-3 px-1">Categories</p>
                    <SidebarCategoryList categories={categories} />
                  </div>
                )}
              </div>
            </aside>

            {/* ── Main content ── */}
            <main className="flex-1 min-w-0 pb-12">
              {/* Mobile search bar */}
              {!catLoading && !catError && (
                <div className="relative group mt-5 mb-1 md:hidden">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[#805032] group-focus-within:text-[#a33800] transition-colors">search</span>
                  </div>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search curated flavors..."
                    className="w-full py-3.5 pl-12 pr-10 bg-white border-none rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a33800]/20 font-[Manrope] text-sm placeholder:text-[#805032]/50 text-[#4b240a]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-4 flex items-center text-[#805032] hover:text-[#a33800] transition-colors"
                      aria-label="Clear search"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  )}
                </div>
              )}

              {catLoading ? (
                <>
                  <div className="mt-5"><SkeletonCategoryTabs /></div>
                  <div className="mt-6"><SkeletonGrid count={4} /></div>
                </>
              ) : catError ? (
                <ErrorState message="Our kitchen is momentarily disconnected." onRetry={retryCat} />
              ) : (
                <CatalogView catalog={catalog} categories={categories} searchQuery={searchQuery} />
              )}
            </main>

          </div>
        )}
      </div>
    </div>
  );
}

// Sidebar category list — scrolls to section on click
function SidebarCategoryList({ categories }: { categories: { id: string; name: string; item_count: number }[] }) {
  function scrollTo(name: string) {
    const el = document.getElementById(`category-${name}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav className="space-y-0.5">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => scrollTo(cat.name)}
          className="w-full text-left px-3 py-2 rounded-lg text-sm font-[Manrope] font-medium text-[#805032] hover:bg-[#ffede5] hover:text-[#a33800] transition-colors flex justify-between items-center group"
        >
          <span>{cat.name}</span>
          <span className="text-[10px] text-[#805032]/50 group-hover:text-[#a33800]/50">{cat.item_count}</span>
        </button>
      ))}
    </nav>
  );
}
