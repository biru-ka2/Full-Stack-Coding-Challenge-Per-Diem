"use client";

import type { Location } from "@/types";

interface Props {
  locations: Location[];
  selected: string | null;
  onChange: (id: string) => void;
}

export function LocationSelector({ locations, selected, onChange }: Props) {
  return (
    <div className="w-full max-w-sm">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Location
      </label>
      <select
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selected ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          Choose a location...
        </option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.name} {loc.address ? `— ${loc.address}` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
