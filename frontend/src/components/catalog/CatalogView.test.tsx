import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CatalogView } from "./CatalogView";
import type { CatalogGroup, Category } from "@/types";

const catalog: CatalogGroup[] = [
  {
    category: "Beverages",
    items: [
      {
        id: "1",
        name: "Cold Brew",
        description: "Iced coffee",
        category: "Beverages",
        image_url: null,
        variations: [],
      },
      {
        id: "2",
        name: "Muffin",
        description: "Blueberry",
        category: "Beverages",
        image_url: null,
        variations: [],
      },
    ],
  },
];

const categories: Category[] = [{ id: "c1", name: "Beverages", item_count: 2 }];

describe("CatalogView", () => {
  it("filters items by search query on name and description", () => {
    render(<CatalogView catalog={catalog} categories={categories} searchQuery="muffin" />);

    expect(screen.getByText("Muffin")).toBeInTheDocument();
    expect(screen.queryByText("Cold Brew")).not.toBeInTheDocument();
  });

  it("shows empty state when search matches nothing", () => {
    render(<CatalogView catalog={catalog} categories={categories} searchQuery="xyznone" />);

    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(screen.getByText(/No results for "xyznone"/)).toBeInTheDocument();
  });
});
