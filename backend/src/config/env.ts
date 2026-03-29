import "dotenv/config";

interface Env {
  nodeEnv: string;
  isProduction: boolean;
  port: number;
  corsOrigin: string;
  squareAccessToken: string;
  squareEnvironment: string;
  squareBaseUrl: string;
  upstashRedisUrl: string | null;
  upstashRedisToken: string | null;
}

export const env: Env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",
  port: parseInt(process.env.PORT ?? "8080", 10),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  squareAccessToken: process.env.SQUARE_ACCESS_TOKEN ?? "",
  squareEnvironment: process.env.SQUARE_ENVIRONMENT ?? "sandbox",
  squareBaseUrl:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com",
  upstashRedisUrl: process.env.UPSTASH_REDIS_REST_URL ?? null,
  upstashRedisToken: process.env.UPSTASH_REDIS_REST_TOKEN ?? null,
};

if (!env.squareAccessToken) {
  console.warn("WARNING: SQUARE_ACCESS_TOKEN is not set");
}
