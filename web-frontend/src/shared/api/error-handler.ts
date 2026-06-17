import axios from "axios";
import { ApiError } from "./axios";
import { logger } from "@/shared/utils/logger";

/**
 * Transforms Axios errors into typed ApiError instances.
 * Called by the response interceptor on every failed request.
 */
export function handleApiError(error: unknown): never {
  let message = "An unexpected error occurred.";
  let status: number | undefined;
  let code: string | undefined;
  let data: unknown;
  let url: string | undefined;
  let method: string | undefined;

  if (axios.isAxiosError(error)) {
    status = error.response?.status;
    data   = error.response?.data;
    url    = error.config?.url;
    method = error.config?.method;

    if (data && typeof data === "object") {
      const responseData = data as Record<string, unknown>;
      message = (responseData.message || responseData.error || error.message) as string;
      code    = responseData.code as string | undefined;
    } else {
      message = error.message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  const apiError = new ApiError(message, status, code, data);

  logger.error(`API Call failed: ${message}`, {
    status,
    code,
    url,
    method,
  });

  throw apiError;
}
