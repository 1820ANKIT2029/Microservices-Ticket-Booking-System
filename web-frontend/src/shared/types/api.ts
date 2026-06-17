/**
 * Canonical API types — single source of truth for all HTTP response shapes.
 * Every service and hook must import from here, never redeclare locally.
 */

// ── Response envelope ─────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp?: string;
}

// ── Error shape ───────────────────────────────────────────────────────────────

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  status?: number;
  path?: string;
  timestamp?: string;
}

// ── Pagination ────────────────────────────────────────────────────────────────

/**
 * Spring-Boot style page response wrapper.
 * Backend endpoints that return paginated lists use this envelope.
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export interface PagedRequest {
  page?: number;
  size?: number;
  sort?: SortRequest[];
}

export interface SortRequest {
  field: string;
  direction: "ASC" | "DESC";
}
