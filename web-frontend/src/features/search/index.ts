/**
 * Search feature — public API.
 */
export { SearchService }  from "./api/service";

export type {
  SearchResultEventDto,
  SearchResultEvent,
  SearchFilters,
  SearchRequestDto,
  VenueSearchResponse,
  PageVenueSearchResponse,
  EventSearchResponse,
  PageEventSearchResponse,
} from "./types";
export { searchKeys }     from "./query-keys";
