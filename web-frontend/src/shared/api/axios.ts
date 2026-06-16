import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { logger } from "@/shared/utils/logger";

// Custom API Error structure with clean stack traces
export class ApiError extends Error {
  status?: number;
  code?: string;
  data?: unknown;

  constructor(message: string, status?: number, code?: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

// Instantiate the base Axios client
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isBrowser = typeof window !== "undefined";
    const token = isBrowser ? localStorage.getItem("token") : null;

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      console.warn(`[Axios Warning]: No token attached to request: ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "An unexpected error occurred.";
    let status: number | undefined;
    let code: string | undefined;
    let data: unknown;
    let url: string | undefined;
    let method: string | undefined;

    if (axios.isAxiosError(error)) {
      status = error.response?.status;
      data = error.response?.data;
      url = error.config?.url;
      method = error.config?.method;

      // Extract meaningful server messages if available
      if (data && typeof data === "object") {
        const responseData = data as Record<string, unknown>;
        message = (responseData.message || responseData.error || error.message) as string;
        code = responseData.code as string | undefined;
      } else {
        message = error.message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    const apiError = new ApiError(message, status, code, data);

    // Contextual application logger capture
    logger.error(`API Call failed: ${message}`, {
      status,
      code,
      url,
      method,
    });

    return Promise.reject(apiError);
  }
);