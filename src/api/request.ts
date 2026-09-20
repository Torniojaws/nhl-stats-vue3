export const proxy = "https://cors.io/?url=";

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

const responseCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<unknown>>();
const MAX_CACHE_ENTRIES = 100;

const parseApiResponse = (response: unknown): unknown => {
  if (typeof response === "object" && response !== null && "body" in response) {
    const body = (response as { body?: string }).body;
    return typeof body === "string" ? JSON.parse(body) : body;
  }
  return response;
};

const pruneCache = (): void => {
  const now = Date.now();
  for (const [key, entry] of responseCache) {
    if (entry.expiresAt <= now) responseCache.delete(key);
  }

  while (responseCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = responseCache.keys().next().value;
    if (!oldestKey) break;
    responseCache.delete(oldestKey);
  }
};

export const fetchProxyJson = async <T>(
  targetUrl: string,
  cacheTtlMs: number,
  signal?: AbortSignal
): Promise<T> => {
  if (signal?.aborted) throw new DOMException("Request aborted", "AbortError");

  const cacheKey = targetUrl;
  const cached = responseCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value as T;
  }
  responseCache.delete(cacheKey);

  const existingRequest = inFlightRequests.get(cacheKey);
  if (existingRequest) return existingRequest as Promise<T>;

  const request = fetch(`${proxy}${encodeURIComponent(targetUrl)}`, { signal })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`NHL API request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then(parseApiResponse)
    .then((value) => {
      pruneCache();
      responseCache.set(cacheKey, {
        value,
        expiresAt: Date.now() + cacheTtlMs,
      });
      return value;
    })
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  inFlightRequests.set(cacheKey, request);
  return request as Promise<T>;
};
