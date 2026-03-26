const { fetchLocations } = require("./square.service");
const cache = require("./cache.service");

const CACHE_KEY = "locations";

/**
 * @typedef {Object} LocationResponse
 * @property {string} id
 * @property {string} name
 * @property {string | null} address
 * @property {string | null} timezone
 * @property {'ACTIVE' | 'INACTIVE'} status
 */

/**
 * Get all active locations, with caching.
 * @returns {Promise<LocationResponse[]>}
 */
const getActiveLocations = async () => {
  const cached = cache.get(CACHE_KEY);
  if (cached) return cached;

  const locations = await fetchLocations();

  /** @type {LocationResponse[]} */
  const result = locations
    .filter((loc) => loc.status === "ACTIVE")
    .map((loc) => ({
      id: loc.id,
      name: loc.name,
      address: loc.address
        ? [
            loc.address.address_line_1,
            loc.address.locality,
            loc.address.administrative_district_level_1,
            loc.address.postal_code,
          ]
            .filter(Boolean)
            .join(", ")
        : null,
      timezone: loc.timezone || null,
      status: loc.status,
    }));

  cache.set(CACHE_KEY, result);
  return result;
};

module.exports = { getActiveLocations };
