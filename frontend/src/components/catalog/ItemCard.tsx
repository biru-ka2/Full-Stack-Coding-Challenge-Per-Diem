import type { CatalogItem } from "@/types";

interface Props {
  item: CatalogItem;
}

function formatPrice(cents: number | null): string {
  if (cents === null) return "Price varies";
  return `$${(cents / 100).toFixed(2)}`;
}

export function ItemCard({ item }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="mt-3 space-y-1">
          {item.variations.map((v) => (
            <div key={v.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{v.name}</span>
              <span className="font-medium text-gray-900">
                {formatPrice(v.price)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
