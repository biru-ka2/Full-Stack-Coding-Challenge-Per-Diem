"use client";

import { useState } from "react";
import type { CatalogItem } from "@/types";

interface Props {
  item: CatalogItem;
  featured?: boolean;
}

function formatPrice(cents: number | null, currency: string | null): string {
  if (cents === null) return "Market price";
  const value = cents / 100;
  if (currency) {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
    } catch {
      // fall through to a simple USD-style format
    }
  }
  return "$" + value.toFixed(2);
}

export function ItemCard({ item, featured = false }: Props) {
  const [expanded, setExpanded] = useState(false);
  const desc = item.description ?? "";
  const isLong = desc.length > 120;
  const displayDesc = isLong && !expanded ? desc.slice(0, 120).trimEnd() + "..." : desc;

  const firstPrice = item.variations[0]?.price ?? null;
  const firstCurrency = item.variations[0]?.currency ?? null;
  const singleVariation = item.variations.length === 1;

  if (featured) {
    return (
      <div className="group bg-[#ffede5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500">
        <div className="aspect-video overflow-hidden relative">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#ffc5a5] to-[#ff7941]/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-[#a33800]/20">restaurant</span>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-[#f8a91f]/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#4d3100]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="font-[Manrope] text-[10px] font-black uppercase tracking-wider text-[#4d3100]">Featured</span>
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-[Epilogue] font-bold text-xl text-[#4b240a] leading-tight pr-2">{item.name}</h3>
            <span className="font-[Epilogue] font-black text-[#a33800] flex-shrink-0">{formatPrice(firstPrice, firstCurrency)}</span>
          </div>
          {desc && (
            <p className="font-[Manrope] text-[#805032] text-sm mb-4 leading-relaxed">
              {displayDesc}
              {isLong && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="ml-1 text-[#a33800] font-bold hover:underline focus:outline-none"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </p>
          )}
          {!singleVariation && item.variations.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {item.variations.map((v) => (
                <div key={v.id} className="flex-1 min-w-[80px] bg-[#ffd4bd] p-3 rounded-lg text-center">
                  <span className="block text-[10px] font-[Manrope] text-[#805032] uppercase tracking-widest mb-1">{v.name}</span>
                  <span className="font-[Epilogue] font-bold text-[#4b240a] text-sm">{formatPrice(v.price, v.currency ?? firstCurrency)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#ffede5] rounded-xl overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="w-1/3 overflow-hidden flex-shrink-0">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full min-h-[120px] bg-gradient-to-br from-[#ffc5a5] to-[#ff7941]/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-[#a33800]/20">restaurant</span>
          </div>
        )}
      </div>
      <div className="w-2/3 p-4 flex flex-col justify-between">
        <div>
          <h4 className="font-[Epilogue] font-bold text-base text-[#4b240a] leading-snug mb-1">{item.name}</h4>
          {desc && (
            <p className="font-[Manrope] text-xs text-[#805032] line-clamp-2 leading-relaxed">
              {displayDesc}
            </p>
          )}
        </div>
        <div className="mt-3 flex justify-between items-center">
          <div>
            {singleVariation ? (
              <span className="font-[Epilogue] font-bold text-[#a33800]">{formatPrice(firstPrice, firstCurrency)}</span>
            ) : (
              <span className="font-[Epilogue] font-bold text-[#a33800] text-sm">
                from {formatPrice(firstPrice, firstCurrency)}
              </span>
            )}
          </div>
          <button
            className="w-8 h-8 rounded-full bg-[#ff7941] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-sm"
            aria-label={`Add ${item.name}`}
          >
            <span className="material-symbols-outlined text-base">add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
