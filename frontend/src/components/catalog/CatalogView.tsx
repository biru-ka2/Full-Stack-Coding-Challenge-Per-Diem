"use client";

import { useState } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { ItemCard } from "./ItemCard";
import type { CatalogGroup, Category } from "@/types";

interface Props {
  catalog: CatalogGroup[];
  categories: Category[];
  searchQuery?: string;
}

export function CatalogView({ catalog, categories, searchQuery = "" }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const query = searchQuery.trim().toLowerCase();

  const filtered = catalog
    .map((group) => {
      if (activeCategory && group.category !== activeCategory) return null;
      if (!query) return group;
      const matchingItems = group.items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          (item.description ?? "").toLowerCase().includes(query)
      );
      return matchingItems.length > 0 ? { ...group, items: matchingItems } : null;
    })
    .filter((g): g is CatalogGroup => g !== null);

  return (
    <div>
      {/* Category tabs — mobile/tablet only; desktop uses sidebar */}
      <div className="lg:hidden">
        <CategoryFilter
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-[#dd9f7c]/40 mb-4">sentiment_dissatisfied</span>
          <h3 className="font-[Epilogue] font-bold text-xl text-[#4b240a]">No items found</h3>
          <p className="font-[Manrope] text-[#805032] mt-2 text-sm max-w-xs">
            {query
              ? `No results for "${searchQuery}". Try a different search.`
              : "Try selecting a different category or location."}
          </p>
        </div>
      ) : (
        <div className="space-y-12 mt-6">
          {filtered.map((group) => (
            <section key={group.category} id={`category-${group.category}`} className="scroll-mt-24">
              <div className="flex justify-between items-end mb-5">
                <div>
                  <h2 className="font-[Epilogue] font-bold text-2xl text-[#4b240a] tracking-tight">
                    {group.category}
                  </h2>
                  <p className="font-[Manrope] text-sm text-[#805032] mt-0.5">
                    {group.items.length} {group.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              <ItemGrid items={group.items} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function ItemGrid({ items }: { items: import("@/types").CatalogItem[] }) {
  if (items.length === 1) {
    return <ItemCard item={items[0]} featured />;
  }

  // On desktop (lg): featured card top-left spanning 1 col, rest in a 2-col grid beside it
  // On mobile: featured full width, rest stacked
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Featured — takes up 1 col on lg, full width on mobile */}
      <div className="lg:col-span-1">
        <ItemCard item={items[0]} featured />
      </div>
      {/* Rest — 2-col grid on lg */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
        {items.slice(1).map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
