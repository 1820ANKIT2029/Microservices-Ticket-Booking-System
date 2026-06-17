import axios from "axios";
import { config } from "@/shared/config";
import { requestInterceptor, requestErrorInterceptor } from "./interceptors";
import { handleApiError } from "./error-handler";

/**
 * Typed API error — thrown by the response interceptor on every failed request.
 * Catch this in components or error boundaries for structured error handling.
 */
export class ApiError extends Error {
  status?: number;
  code?: string;
  data?: unknown;

  constructor(message: string, status?: number, code?: string, data?: unknown) {
    super(message);
    this.name   = "ApiError";
    this.status = status;
    this.code   = code;
    this.data   = data;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Singleton Axios instance for all API calls.
 * Never create a second axios instance — always import `api` from here.
 */
export const api = axios.create({
  baseURL: config.api.baseUrl,
});

// ── Request interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use(requestInterceptor, requestErrorInterceptor);

// ── Response interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => handleApiError(error)
);