import { SearchService as SharedSearchService, VenueService, EventService } from "@/shared/api/services";

export class SearchService {
  static searchVenues(keyword?: string, page = 0, size = 10, sort?: string[]) {
    return VenueService.searchVenues(keyword, page, size, sort);
  }

  static searchPerformers(name: string, page = 0, size = 10, sort?: string[]) {
    return SharedSearchService.searchPerformers(name, page, size, sort);
  }

  static searchEventsCatalog(keyword?: string, status?: string, eventType?: string, page = 0, size = 10, sort?: string[]) {
    return EventService.searchEventsCatalog(keyword, status, eventType, page, size, sort);
  }
}
