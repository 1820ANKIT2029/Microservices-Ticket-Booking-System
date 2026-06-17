import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import type { SearchResultEventDto, SearchFilters } from "../types";

/**
 * SearchService — HTTP calls for the search domain.
 */
export class SearchService {
  static searchEvents(query: string, filters?: Partial<SearchFilters>) {
    const params = {
      q:          query,
      categories: filters?.categories?.join(","),
      dates:      filters?.dates?.join(","),
      maxPrice:   filters?.maxPrice,
      venue:      filters?.venue,
    };
    return api
      .get<ApiResponse<SearchResultEventDto[]>>("/search", { params })
      .then((res) => res.data.data);
  }
}
