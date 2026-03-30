import { describe, it, expect } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/test/msw/server";
import { useLocations } from "./useLocations";
import { defaultLocations } from "@/test/msw/handlers";

const base = "http://localhost:8080/api";

describe("useLocations", () => {
  it("loads locations then exposes data", async () => {
    const { result } = renderHook(() => useLocations());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.locations).toEqual(defaultLocations);
  });

  it("sets error on failure and retry refetches", async () => {
    server.use(
      http.get(`${base}/locations`, () => HttpResponse.json({ error: "fail" }, { status: 500 }))
    );

    const { result } = renderHook(() => useLocations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Failed to fetch locations");
    expect(result.current.locations).toEqual([]);

    server.resetHandlers();

    await act(async () => {
      result.current.retry();
    });

    await waitFor(() => expect(result.current.error).toBeNull());
    expect(result.current.locations).toEqual(defaultLocations);
  });
});
