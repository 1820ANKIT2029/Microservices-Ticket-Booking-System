"use client";

import { useCallback, useState } from "react";

export interface PaginationState {
  page: number;
  size: number;
}

export interface PaginationActions {
  setPage:   (page: number) => void;
  setSize:   (size: number) => void;
  nextPage:  () => void;
  prevPage:  () => void;
  reset:     () => void;
}

export type UsePaginationReturn = PaginationState & PaginationActions;

/**
 * Manages pagination state (page number + page size).
 * Page is 0-indexed to match Spring Boot's Pageable convention.
 *
 * @param initialPage - Starting page index (default: 0)
 * @param initialSize - Starting page size (default: 10)
 */
export function usePagination(
  initialPage: number = 0,
  initialSize: number = 10
): UsePaginationReturn {
  const [page, setPageState] = useState(initialPage);
  const [size, setSizeState] = useState(initialSize);

  const setPage = useCallback((p: number) => setPageState(Math.max(0, p)), []);
  const setSize = useCallback((s: number) => setSizeState(Math.max(1, s)), []);
  const nextPage = useCallback(() => setPageState((p) => p + 1), []);
  const prevPage = useCallback(() => setPageState((p) => Math.max(0, p - 1)), []);
  const reset    = useCallback(() => { setPageState(initialPage); setSizeState(initialSize); }, [initialPage, initialSize]);

  return { page, size, setPage, setSize, nextPage, prevPage, reset };
}
