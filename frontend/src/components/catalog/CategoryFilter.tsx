"use client";

import type { Category } from "@/types";

interface Props {
  categories: Category[];
  active: string | null;
  onChange: (name: string | null) => void;
}

export function CategoryFilter({ categories, active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          active === null
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.name)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            active === cat.name
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {cat.name}
          <span className="ml-1.5 text-xs opacity-70">({cat.item_count})</span>
        </button>
      ))}
    </div>
  );
}
