/**
 * Centralized API Client & Backend Connection Configuration
 * Handles dynamic environment base URLs, Render free-tier cold starts, generous fetch timeouts, and retry logic.
 */

// Environment base URL resolution (supports Next.js and Vite env standards)
export const API_BASE_URL = (
  (typeof process !== "undefined" && (process.env.NEXT_PUBLIC_API_URL || process.env.VITE_API_URL)) ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export const getApiDocsUrl = (): string => {
  return `${API_BASE_URL}/docs`;
};

// Form-field constants defined for backend FastAPI schema matching
export const FIELD_FILE = "file";
export const FIELD_CSV_DATA = "csv_data";
export const FIELD_STRATEGY = "strategy";
export const FIELD_REMOVE_DUPLICATES = "remove_duplicates";
export const FIELD_METHOD = "method";
export const FIELD_ACTION = "action";
export const FIELD_COLUMN = "column";
export const FIELD_TARGET = "target";
export const FIELD_TASK_TYPE = "task_type";
export const FIELD_MESSAGE = "message";

// Cold start listener event emitter
type ColdStartListener = (isWaking: boolean, message?: string) => void;
const coldStartListeners: Set<ColdStartListener> = new Set();

export const subscribeColdStart = (listener: ColdStartListener): (() => void) => {
  coldStartListeners.add(listener);
  return () => {
    coldStartListeners.delete(listener);
  };
};

export const notifyColdStart = (isWaking: boolean, message?: string) => {
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
  let coldStartTimer: ReturnType<typeof setTimeout> | null = null;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    // If request takes longer than 3.5 seconds, notify that backend server might be waking up
    coldStartTimer = setTimeout(() => {
      notifyColdStart(true, "Starting analysis server… this can take up to a minute on free tier.");
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
    } catch (err: unknown) {
      clearTimeout(timer);
      if (coldStartTimer) clearTimeout(coldStartTimer);

      if (attempt < retries) {
        attempt++;
        notifyColdStart(true, "Starting analysis server… this can take up to a minute.");
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

// Type definitions matching FastAPI response payloads
export interface ColumnMetadata {
  type: "Numeric" | "Categorical";
  null_count: number;
  unique_count?: number;
  null_pct: number;
  mean?: number;
  std?: number;
  min?: number;
  max?: number;
}

export interface PrivacyFlag {
  column: string;
  type: string;
}

export interface DatasetStats {
  score: number;
  missing_pct: number;
  duplicate_pct: number;
  total_cells: number;
  missing_cells: number;
  duplicate_rows: number;
  total_rows: number;
  columns: string[];
  numeric_cols: string[];
  categorical_cols: string[];
  column_metadata: Record<string, ColumnMetadata>;
  preview: Record<string, string | number | boolean | null>[];
  privacy_flags: PrivacyFlag[];
}

export interface UploadResponse {
  stats: DatasetStats;
  csv_data: string;
  filename: string;
}

export interface CleanResponse {
  stats: DatasetStats;
  csv_data: string;
}

export interface OutlierResponse {
  stats: DatasetStats;
  csv_data: string;
}

export interface HistogramBin {
  bin: string;
  count: number;
}

export interface EDAResponse {
  histogram: HistogramBin[];
  correlation: Record<string, Record<string, number>>;
  numeric_cols: string[];
}

export interface ModelLeaderboardItem {
  model: string;
  metric: string;
  score: string;
  raw_score?: number;
}

export interface TrainResponse {
  task_type: "Classification" | "Regression";
  leaderboard: ModelLeaderboardItem[];
  folds: number;
  features_used: string[];
}

export interface ChatResponse {
  reply: string;
}

/**
 * High-level API Service Client
 */
export const apiClient = {
  async health(): Promise<{ status: string }> {
    const res = await apiFetch("/health", { method: "GET" });
    if (!res.ok) throw new Error("Health check failed");
    return res.json();
  },

  async upload(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append(FIELD_FILE, file);

    const res = await apiFetch("/api/upload", {
      method: "POST",
      body: formData,
      timeoutMs: 75000,
    });

    if (!res.ok) {
      let detail = "The dataset could not be processed.";
      try {
        const json = await res.json();
        if (json?.detail) detail = json.detail;
      } catch {}
      throw new Error(detail);
    }

    return res.json();
  },

  async clean(
    csvData: string,
    strategy: "Drop rows" | "Mean" | "Median",
    removeDuplicates: boolean
  ): Promise<CleanResponse> {
    const formData = new FormData();
    formData.append(FIELD_CSV_DATA, csvData);
    formData.append(FIELD_STRATEGY, strategy);
    formData.append(FIELD_REMOVE_DUPLICATES, String(removeDuplicates));

    const res = await apiFetch("/api/clean", {
      method: "POST",
      body: formData,
      timeoutMs: 75000,
    });

    if (!res.ok) {
      let detail = "Data cleaning operation failed.";
      try {
        const json = await res.json();
        if (json?.detail) detail = json.detail;
      } catch {}
      throw new Error(detail);
    }

    return res.json();
  },

  async outliers(
    csvData: string,
    method: "Z-score" | "IQR",
    action: "Cap" | "Remove"
  ): Promise<OutlierResponse> {
    const formData = new FormData();
    formData.append(FIELD_CSV_DATA, csvData);
    formData.append(FIELD_METHOD, method);
    formData.append(FIELD_ACTION, action);

    const res = await apiFetch("/api/outliers", {
      method: "POST",
      body: formData,
      timeoutMs: 75000,
    });

    if (!res.ok) {
      let detail = "Outlier treatment failed.";
      try {
        const json = await res.json();
        if (json?.detail) detail = json.detail;
      } catch {}
      throw new Error(detail);
    }

    return res.json();
  },

  async eda(csvData: string, column: string): Promise<EDAResponse> {
    const formData = new FormData();
    formData.append(FIELD_CSV_DATA, csvData);
    formData.append(FIELD_COLUMN, column);

    const res = await apiFetch("/api/eda", {
      method: "POST",
      body: formData,
      timeoutMs: 75000,
    });

    if (!res.ok) {
      let detail = "Exploratory data analysis failed.";
      try {
        const json = await res.json();
        if (json?.detail) detail = json.detail;
      } catch {}
      throw new Error(detail);
    }

    return res.json();
  },

  async train(
    csvData: string,
    target: string,
    taskType?: "Classification" | "Regression" | null
  ): Promise<TrainResponse> {
    const formData = new FormData();
    formData.append(FIELD_CSV_DATA, csvData);
    formData.append(FIELD_TARGET, target);
    if (taskType) {
      formData.append(FIELD_TASK_TYPE, taskType);
    }

    const res = await apiFetch("/api/train", {
      method: "POST",
      body: formData,
      timeoutMs: 75000,
    });

    if (!res.ok) {
      let detail = "Model benchmarking failed.";
      try {
        const json = await res.json();
        if (json?.detail) detail = json.detail;
      } catch {}
      throw new Error(detail);
    }

    return res.json();
  },

  async chat(csvData: string, message: string): Promise<ChatResponse> {
    const formData = new FormData();
    formData.append(FIELD_CSV_DATA, csvData);
    formData.append(FIELD_MESSAGE, message);

    const res = await apiFetch("/api/chat", {
      method: "POST",
      body: formData,
      timeoutMs: 65000,
    });

    if (!res.ok) {
      let detail = "Data chat query failed.";
      try {
        const json = await res.json();
        if (json?.detail) detail = json.detail;
      } catch {}
      throw new Error(detail);
    }

    return res.json();
  },
};
