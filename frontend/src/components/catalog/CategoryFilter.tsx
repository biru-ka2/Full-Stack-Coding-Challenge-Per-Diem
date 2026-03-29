"use client";

import type { Category } from "@/types";

interface Props {
  categories: Category[];
  active: string | null;
  onChange: (name: string | null) => void;
}

export function CategoryFilter({ categories, active, onChange }: Props) {
  function handleClick(name: string | null) {
    onChange(name);
    if (name) {
      const el = document.getElementById(`category-${name}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <nav className="flex overflow-x-auto gap-3 mb-8 pb-1 sticky top-[72px] z-40 bg-[#fff4f0]/80 backdrop-blur-sm -mx-4 px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        onClick={() => handleClick(null)}
        className={`flex-none px-5 py-2 rounded-full font-[Epilogue] font-bold text-sm transition-all duration-200 ${
          active === null
            ? "bg-gradient-to-br from-[#a33800] to-[#ff7941] text-white shadow-lg shadow-[#a33800]/20"
            : "bg-[#ffe3d4] text-[#805032] hover:bg-[#ffdbc9]"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleClick(cat.name)}
          className={`flex-none px-5 py-2 rounded-full font-[Epilogue] font-semibold text-sm transition-all duration-200 ${
            active === cat.name
              ? "bg-gradient-to-br from-[#a33800] to-[#ff7941] text-white shadow-lg shadow-[#a33800]/20"
              : "bg-[#ffe3d4] text-[#805032] hover:bg-[#ffdbc9]"
          }`}
        >
          {cat.name}
          <span className="ml-1.5 text-[10px] opacity-60">({cat.item_count})</span>
        </button>
      ))}
    </nav>
  );
}
