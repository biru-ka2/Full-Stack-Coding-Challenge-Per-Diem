"use client";

import type { Location } from "@/types";

interface Props {
  locations: Location[];
  selected: string | null;
  onChange: (id: string) => void;
}

export function LocationSelector({ locations, selected, onChange }: Props) {
  return (
    <div className="w-full">
      <label
        htmlFor="location-select"
        className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
      >
        Location
      </label>
      <div className="relative">
        <select
          id="location-select"
          className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
          value={selected ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>
            Choose a location…
          </option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
              {loc.address ? ` — ${loc.address}` : ""}
            </option>
          ))}
        </select>
        {/* chevron icon */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
