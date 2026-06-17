"use client";

import { useQuery } from "@tanstack/react-query";
import { SearchService } from "../api/service";
import { searchKeys } from "../query-keys";
import { useDebounce } from "@/shared/hooks";
import type { SearchResultEvent, SearchFilters } from "../types";

/**
 * Searches events with debounced query and optional filters.
 * Query is disabled when the search term is empty.
 */
export function useSearch(query: string, filters?: Partial<SearchFilters>) {
  const debouncedQuery = useDebounce(query, 400);

  return useQuery<SearchResultEvent[]>({
    queryKey: searchKeys.results(debouncedQuery, filters as Record<string, unknown>),
    queryFn:  () => SearchService.searchEvents(debouncedQuery, filters),
    enabled:  debouncedQuery.trim().length > 0,
  });
}
