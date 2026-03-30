import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getHealthStatus } from "../services/health.service";

describe("getHealthStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:00:00.000Z"));
    vi.spyOn(process, "uptime").mockReturnValue(42.5);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns ok status, ISO timestamp, and uptime", () => {
    const result = getHealthStatus();
    expect(result.status).toBe("ok");
    expect(result.timestamp).toBe("2026-01-15T12:00:00.000Z");
    expect(result.uptime).toBe(42.5);
  });
});

