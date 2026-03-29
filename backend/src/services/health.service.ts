import type { HealthResponse } from "../types";

export function getHealthStatus(): HealthResponse {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
}
