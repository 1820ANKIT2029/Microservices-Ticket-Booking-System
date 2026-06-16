"use client";

import { api } from "@/shared/api";
import { ApiResponse } from "@/shared/types/api-response";
import { SearchResultEvent, SearchFilters } from "../types/search";

export const SearchService = {
  searchEvents: (query: string, filters?: Partial<SearchFilters>) => {
    const params = {
      q: query,
      categories: filters?.categories?.join(","),
      dates: filters?.dates?.join(","),
      maxPrice: filters?.maxPrice,
      venue: filters?.venue,
    };
    return api.get<ApiResponse<SearchResultEvent[]>>("/search", { params });
  },
};
