"use client";

/**
 * shared/hooks — barrel export.
 *
 * Import from "@/shared/hooks" instead of deep-importing individual hook files.
 */
export { useRole }           from "./useRole";
export { useDebounce }       from "./useDebounce";
export { usePagination }     from "./usePagination";
export type { UsePaginationReturn, PaginationState, PaginationActions } from "./usePagination";
export { useInfiniteScroll } from "./useInfiniteScroll";

