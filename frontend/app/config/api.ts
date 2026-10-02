/**
 * Centralized API Client & Backend Connection Configuration
 * Handles dynamic environment base URLs, Render free-tier cold starts, generous fetch timeouts, and retry logic.
 */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export const getApiDocsUrl = (): string => {
  return `${API_BASE_URL}/docs`;
};

// Cold start listener event emitter
type ColdStartListener = (isWaking: boolean, message?: string) => void;
const coldStartListeners: Set<ColdStartListener> = new Set();

export const subscribeColdStart = (listener: ColdStartListener): (() => void) => {
  coldStartListeners.add(listener);
  return () => {
    coldStartListeners.delete(listener);
  };
};

const notifyColdStart = (isWaking: boolean, message?: string) => {
  coldStartListeners.forEach((fn) => fn(isWaking, message));
};

export interface ApiFetchOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

/**
 * Robust fetch wrapper for FastAPI backend endpoints.
 * Includes cold-start detection, timeout handling, and automatic retry.
 */
export async function apiFetch(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<Response> {
  const {
    timeoutMs = 75000, // 75 seconds for Render free tier cold starts
    retries = 1,
    retryDelayMs = 2500,
    ...fetchOptions
  } = options;

  const url = endpoint.startsWith("http://") || endpoint.startsWith("https://")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  let attempt = 0;
  let coldStartTimer: NodeJS.Timeout | null = null;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    // If request takes longer than 3.5 seconds, notify that backend server might be waking up
    coldStartTimer = setTimeout(() => {
      notifyColdStart(true, "Waking up server (Render cold start)... Please wait a few moments.");
    }, 3500);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timer);
      if (coldStartTimer) clearTimeout(coldStartTimer);
      notifyColdStart(false);

      // Render returns 502/503/504 while container is booting
      if ([502, 503, 504].includes(response.status) && attempt < retries) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        continue;
      }

      return response;
    } catch (err: any) {
      clearTimeout(timer);
      if (coldStartTimer) clearTimeout(coldStartTimer);

      if (attempt < retries) {
        attempt++;
        notifyColdStart(true, "Server is booting up... Retrying connection.");
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        continue;
      }

      notifyColdStart(false);
      throw err;
    }
  }

  throw new Error(`API fetch failed after ${retries + 1} attempts`);
}

/**
 * Non-blocking health ping to pre-warm the Render backend container when user loads the web app.
 */
let hasPingedHealth = false;
export async function pingBackendHealth(): Promise<boolean> {
  if (hasPingedHealth) return true;
  hasPingedHealth = true;

  try {
    const res = await apiFetch("/health", { timeoutMs: 70000, retries: 0 });
    return res.ok;
  } catch (err) {
    console.debug("Backend health pre-warm probe dispatched", err);
    return false;
  }
}
