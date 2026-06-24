import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import type { PerformerResponseDto } from "@/features/events/types";

// PagePerformerDTO structure locally for search service response
export interface PagePerformerDTO {
  totalPages: number;
  totalElements: number;
  size: number;
  content: PerformerResponseDto[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

/**
 * SearchService — centralized HTTP calls for generic catalog searches.
 * Note: specific entity searches like Venue search and Event search are in their respective services.
 */
export class SearchService {
  /**
   * Search performers in the catalog.
   */
  static searchPerformers(name: string, page = 0, size = 10, sort?: string[]) {
    return api
      .get<ApiResponse<PagePerformerDTO>>("/event/api/performers/search", {
        params: { name, page, size, sort: sort?.join(",") },
      })
      .then((res) => res.data.data);
  }
}
