/**
 * Simple in-memory cache with TTL support
 * @typedef {{ value: any, expiresAt: number }} CacheEntry
 */

/** @type {Map<string, CacheEntry>} */
const store = new Map();

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Get a cached value by key. Returns null if missing or expired.
 * @param {string} key
 * @returns {any | null}
 */
const get = (key) => {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
};

/**
 * Set a value in the cache with optional TTL.
 * @param {string} key
 * @param {any} value
 * @param {number} [ttlMs]
 */
const set = (key, value, ttlMs = DEFAULT_TTL_MS) => {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
};

/**
 * Delete a key from the cache.
 * @param {string} key
 */
const del = (key) => store.delete(key);

/** Clear the entire cache. */
const clear = () => store.clear();

module.exports = { get, set, del, clear };
