import https from "https";
import { env } from "../config/env";
import { AppError } from "../utils/errors";
import type { SquareCatalogObject, SquareLocation, SquareError } from "../types";

// ── HTTP helper ──────────────────────────────────────────────────────

function squareRequest<T>(path: string, method: "GET" | "POST" = "GET", body?: object): Promise<T> {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;

    const options: https.RequestOptions = {
      hostname: new URL(env.squareBaseUrl).hostname,
      path,
      method,
      headers: {
        Authorization: `Bearer ${env.squareAccessToken}`,
        "Content-Type": "application/json",
        "Square-Version": "2024-01-18",
        ...(payload ? { "Content-Length": String(Buffer.byteLength(payload)) } : {}),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk: string) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data) as { errors?: SquareError[] } & T;
          if (parsed.errors && parsed.errors.length > 0) {
            const e = parsed.errors[0];
            return reject(
              new AppError(
                mapSquareErrorMessage(e),
                mapSquareStatusCode(e.category)
              )
            );
          }
          resolve(parsed);
        } catch {
          reject(new AppError("Failed to parse Square API response", 502));
        }
      });
    });

    req.on("error", () => reject(new AppError("Square API request failed — upstream unavailable", 502)));
    if (payload) req.write(payload);
    req.end();
  });
}

function mapSquareErrorMessage(e: SquareError): string {
  return e.detail ?? `Square error: ${e.code}`;
}

function mapSquareStatusCode(category: string): number {
  const map: Record<string, number> = {
    AUTHENTICATION_ERROR: 401,
    INVALID_REQUEST_ERROR: 400,
    RATE_LIMIT_ERROR: 429,
    PAYMENT_METHOD_ERROR: 402,
    REFUND_ERROR: 400,
  };
  return map[category] ?? 502;
}

// ── Public API ───────────────────────────────────────────────────────

interface LocationsResponse {
  locations?: SquareLocation[];
}

export async function fetchLocations(): Promise<SquareLocation[]> {
  const data = await squareRequest<LocationsResponse>("/v2/locations");
  return data.locations ?? [];
}

interface CatalogSearchBody {
  object_types: string[];
  include_related_objects: boolean;
  cursor?: string;
}

interface CatalogSearchResponse {
  objects?: SquareCatalogObject[];
  related_objects?: SquareCatalogObject[];
  cursor?: string;
}

export interface CatalogFetchResult {
  objects: SquareCatalogObject[];
  related_objects: SquareCatalogObject[];
}

/**
 * Fetches all catalog objects, transparently handling Square's cursor-based pagination.
 */
export async function fetchAllCatalogObjects(searchBody: Omit<CatalogSearchBody, "cursor">): Promise<CatalogFetchResult> {
  const allObjects: SquareCatalogObject[] = [];
  const allRelated: SquareCatalogObject[] = [];
  let cursor: string | undefined;

  do {
    const body: CatalogSearchBody = cursor ? { ...searchBody, cursor } : searchBody;
    const data = await squareRequest<CatalogSearchResponse>("/v2/catalog/search", "POST", body);

    if (data.objects) allObjects.push(...data.objects);
    if (data.related_objects) allRelated.push(...data.related_objects);

    cursor = data.cursor;
  } while (cursor);

  return { objects: allObjects, related_objects: allRelated };
}
