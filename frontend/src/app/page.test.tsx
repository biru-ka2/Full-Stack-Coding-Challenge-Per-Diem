import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "./page";
import { http, HttpResponse } from "msw";
import { server } from "@/test/msw/server";

describe("HomePage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows a main loading state while locations are loading", async () => {
    server.use(
      http.get("http://localhost:8080/api/locations", async () => {
        await new Promise((r) => setTimeout(r, 50));
        return HttpResponse.json({
          locations: [
            { id: "loc-1", name: "Test Cafe", address: "1 Main St", timezone: "America/New_York", status: "ACTIVE" },
          ],
        });
      })
    );

    render(<HomePage />);

    expect(screen.getByText("Loading locations…")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Choose your location")).toBeInTheDocument());
  });

  it("shows a main error state when locations fail to load", async () => {
    server.use(
      http.get("http://localhost:8080/api/locations", () => HttpResponse.json({ error: "fail" }, { status: 500 }))
    );

    render(<HomePage />);

    await waitFor(() => expect(screen.getByText("Connection lost")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Retry Connection" })).toBeInTheDocument();
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
