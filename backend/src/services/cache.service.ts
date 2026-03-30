import { env } from "../config/env";
import { Redis } from "@upstash/redis";

const DEFAULT_TTL_S = 5 * 60;

// ── In-memory fallback ───────────────────────────────────────────────

interface MemEntry { value: unknown; expiresAt: number; }
const memStore = new Map<string, MemEntry>();

const memGet = <T>(key: string): T | null => {
  const entry = memStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { memStore.delete(key); return null; }
  return entry.value as T;
};

const memSet = (key: string, value: unknown, ttlS: number): void => {
  memStore.set(key, { value, expiresAt: Date.now() + ttlS * 1000 });
};

// ── Local Redis (optional) ────────────────────────────────────────────

type RedisClient = {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, opts: { EX: number }) => Promise<unknown>;
  del: (...keys: string[]) => Promise<unknown>;
};

let redis: RedisClient | null = null;

if (env.redisUrl) {
  import("redis")
    .then(({ createClient }) => {
      const client = createClient({ url: env.redisUrl! });
      client.on("error", (err: Error) => {
        console.warn("[cache] Redis error — using in-memory cache:", err.message);
      });
      return client.connect().then(() => client);
    })
    .then((client) => {
      redis = client as unknown as RedisClient;
      console.log("[cache] Redis connected");
    })
    .catch((err: Error) => {
      console.warn("[cache] Redis unavailable — using in-memory cache:", err.message);
    });
}

// ── Upstash Redis (optional) ─────────────────────────────────────────
// Uses the REST API over HTTPS — works on serverless/Vercel with no
// persistent connections required.

type UpstashClient = {
  get: <T>(key: string) => Promise<T | null>;
  set: (key: string, value: unknown, opts: { ex: number }) => Promise<unknown>;
  del: (...keys: string[]) => Promise<unknown>;
};

let upstash: UpstashClient | null = null;

if (env.upstashRedisUrl && env.upstashRedisToken) {
  // Dynamically import so the module is optional at runtime
  import("@upstash/redis")
    .then(({ Redis }) => {
      upstash = new Redis({
        url: env.upstashRedisUrl!,
        token: env.upstashRedisToken!,
      });
      console.log("[cache] Upstash Redis connected");
    })
    .catch((err: Error) => {
      console.warn("[cache] Upstash Redis unavailable — using in-memory cache:", err.message);
    });
} else {
  console.log("[cache] No Upstash credentials set — using in-memory cache");
}

// ── Public interface ─────────────────────────────────────────────────

export async function get<T>(key: string): Promise<T | null> {
  if (upstash) {
    try { return await upstash.get<T>(key); } catch { /* fall through */ }
  }
  if (redis) {
    try {
      const raw = await redis.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch { /* fall through */ }
  }
  return memGet<T>(key);
}

export async function set(key: string, value: unknown, ttlS = DEFAULT_TTL_S): Promise<void> {
  if (upstash) {
    try { await upstash.set(key, value, { ex: ttlS }); return; } catch { /* fall through */ }
  }
  if (redis) {
    try { await redis.set(key, JSON.stringify(value), { EX: ttlS }); return; } catch { /* fall through */ }
  }
  memSet(key, value, ttlS);
}

export async function del(key: string): Promise<void> {
  if (upstash) {
    try { await upstash.del(key); } catch { /* ignore */ }
  }
  if (redis) {
    try { await redis.del(key); } catch { /* ignore */ }
  }
  memStore.delete(key);
}
