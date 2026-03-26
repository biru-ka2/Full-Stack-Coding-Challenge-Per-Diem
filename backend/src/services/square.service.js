const https = require("https");
const { env } = require("../config/env");
const { AppError } = require("../utils/errors");

/**
 * @typedef {Object} SquareLocation
 * @property {string} id
 * @property {string} name
 * @property {Object} [address]
 * @property {string} [timezone]
 * @property {string} status
 */

/**
 * @typedef {Object} SquareCatalogObject
 * @property {string} id
 * @property {string} type
 * @property {boolean} [present_at_all_locations]
 * @property {string[]} [present_at_location_ids]
 * @property {Object} [item_data]
 * @property {Object} [category_data]
 * @property {Object} [image_data]
 */

/**
 * Make a raw HTTPS request to the Square API.
 * @param {string} path
 * @param {'GET'|'POST'} method
 * @param {Object} [body]
 * @returns {Promise<any>}
 */
const squareRequest = (path, method = "GET", body = null) => {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;

    const options = {
      hostname: new URL(env.squareBaseUrl).hostname,
      path,
      method,
      headers: {
        Authorization: `Bearer ${env.squareAccessToken}`,
        "Content-Type": "application/json",
        "Square-Version": "2024-01-18",
        ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.errors && parsed.errors.length > 0) {
            const err = parsed.errors[0];
            return reject(
              new AppError(
                `Square API error: ${err.detail || err.code}`,
                mapSquareStatusCode(err.category)
              )
            );
          }
          resolve(parsed);
        } catch {
          reject(new AppError("Failed to parse Square API response", 502));
        }
      });
    });

    req.on("error", () => reject(new AppError("Square API request failed", 502)));
    if (payload) req.write(payload);
    req.end();
  });
};

/**
 * Map Square error category to HTTP status code.
 * @param {string} category
 * @returns {number}
 */
const mapSquareStatusCode = (category) => {
  const map = {
    AUTHENTICATION_ERROR: 401,
    INVALID_REQUEST_ERROR: 400,
    RATE_LIMIT_ERROR: 429,
    PAYMENT_METHOD_ERROR: 402,
    REFUND_ERROR: 400,
  };
  return map[category] || 502;
};

/**
 * Fetch all locations from Square.
 * @returns {Promise<SquareLocation[]>}
 */
const fetchLocations = async () => {
  const data = await squareRequest("/v2/locations");
  return data.locations || [];
};

/**
 * Fetch all catalog objects using cursor-based pagination.
 * Handles multiple pages transparently.
 * @param {Object} searchBody
 * @returns {Promise<{ objects: SquareCatalogObject[], related_objects: SquareCatalogObject[] }>}
 */
const fetchAllCatalogObjects = async (searchBody) => {
  /** @type {SquareCatalogObject[]} */
  const allObjects = [];
  /** @type {SquareCatalogObject[]} */
  const allRelated = [];

  let cursor = null;

  do {
    const body = cursor ? { ...searchBody, cursor } : searchBody;
    const data = await squareRequest("/v2/catalog/search", "POST", body);

    if (data.objects) allObjects.push(...data.objects);
    if (data.related_objects) allRelated.push(...data.related_objects);

    cursor = data.cursor || null;
  } while (cursor);

  return { objects: allObjects, related_objects: allRelated };
};

module.exports = { fetchLocations, fetchAllCatalogObjects };
