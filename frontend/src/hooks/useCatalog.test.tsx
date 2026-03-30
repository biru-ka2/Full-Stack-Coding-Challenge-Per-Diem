import { describe, it, expect } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/test/msw/server";
import { useCatalog } from "./useCatalog";
import { defaultCatalog, defaultCategories } from "@/test/msw/handlers";

const base = "http://localhost:8080/api";

describe("useCatalog", () => {
  it("does not load when locationId is null", () => {
    const { result } = renderHook(() => useCatalog(null));
    expect(result.current.loading).toBe(false);
    expect(result.current.catalog).toEqual([]);
  });

  it("loads catalog and categories for locationId", async () => {
    const { result } = renderHook(() => useCatalog("loc-1"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.catalog).toEqual(defaultCatalog);
    expect(result.current.categories).toEqual(defaultCategories);
  });

  it("sets error on failure and retry succeeds", async () => {
    server.use(
      http.get(`${base}/catalog`, () => HttpResponse.json({}, { status: 503 }))
    );

    const { result } = renderHook(() => useCatalog("loc-1"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Failed to fetch catalog");

    server.resetHandlers();

    await act(async () => {
      result.current.retry();
    });

    await waitFor(() => expect(result.current.error).toBeNull());
    expect(result.current.catalog).toEqual(defaultCatalog);
  });
});
