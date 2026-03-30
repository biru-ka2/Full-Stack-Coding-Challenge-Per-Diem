import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "./page";

describe("HomePage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists selectedLocationId to localStorage when a location is chosen", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Choose your location")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Change location" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Test Cafe/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /Test Cafe/i }));

    expect(localStorage.getItem("selectedLocationId")).toBe("loc-1");
  });
});
