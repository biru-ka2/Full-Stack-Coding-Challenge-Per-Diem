"use client";

import { useState } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { ItemCard } from "./ItemCard";
import type { CatalogGroup, Category } from "@/types";

interface Props {
  catalog: CatalogGroup[];
  categories: Category[];
}

export function CatalogView({ catalog, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? catalog.filter((g) => g.category === activeCategory)
    : catalog;

  return (
    <div className="space-y-6">
      <CategoryFilter
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />
      {filtered.map((group) => (
        <section key={group.category}>
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            {group.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
      {filtered.length === 0 && (
        <p className="text-gray-500 text-sm">No items found.</p>
      )}
    </div>
  );
}
