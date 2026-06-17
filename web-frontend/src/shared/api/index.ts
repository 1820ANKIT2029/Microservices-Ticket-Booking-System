/**
 * shared/api — barrel export.
 */
export { api, ApiError } from "./axios";
export { handleApiError } from "./error-handler";
export { requestInterceptor } from "./interceptors";
