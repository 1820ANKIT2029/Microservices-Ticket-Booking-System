import type { InternalAxiosRequestConfig } from "axios";
import { TOKEN_KEY } from "@/shared/constants";
import { logger } from "@/shared/utils/logger";

/**
 * Attaches the Bearer token to every outgoing request.
 * Reads from localStorage for browser environments.
 */
export function requestInterceptor(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  const isBrowser = typeof window !== "undefined";
  const token = isBrowser ? localStorage.getItem(TOKEN_KEY) : null;

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  } else {
    logger.warn(`[Axios] No token for request: ${config.method?.toUpperCase()} ${config.url}`);
  }

  return config;
}

export function requestErrorInterceptor(error: unknown): Promise<never> {
  return Promise.reject(error);
}
