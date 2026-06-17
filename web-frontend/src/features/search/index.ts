/**
 * Search feature — public API.
 */
export { SearchService }  from "./api/service";
export { useSearch }      from "./hooks/useSearch";
export type {
  SearchResultEventDto,
  SearchResultEvent,
  SearchFilters,
  SearchRequestDto,
} from "./types";
export { searchKeys }     from "./query-keys";
