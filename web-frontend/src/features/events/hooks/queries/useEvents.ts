import { useQuery } from "@tanstack/react-query";
import { EventService } from "../../services/event.service";
import { queryKeys } from "@/shared/hooks/keys";
import { Movie, SportsMatch, Concert } from "../../types";
import { SearchResultEvent } from "@/features/search/types/search";

export type EventCategory = "movies" | "sports" | "concerts" | "featured";
export type UnifiedEvent = Movie | SportsMatch | Concert | SearchResultEvent;

export function useEvents(category?: EventCategory, page: number = 1, limit: number = 10) {
  const selectedCategory = category || "featured";

  return useQuery<UnifiedEvent[]>({
    queryKey: queryKeys.events.list({ category: selectedCategory, page, limit }),
    queryFn: () => {
      switch (selectedCategory) {
        case "movies":
          return EventService.getMovies(page, limit).then((res) => res.data.data);
        case "sports":
          return EventService.getSports(page, limit).then((res) => res.data.data);
        case "concerts":
          return EventService.getConcerts(page, limit).then((res) => res.data.data);
        case "featured":
        default:
          return EventService.getFeaturedEvents().then((res) => res.data.data);
      }
    },
  });
}
