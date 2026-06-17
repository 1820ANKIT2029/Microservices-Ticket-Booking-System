import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import type {
  EventResponseDto,
  EventRequestDto,
  VenueResponseDto,
} from "../types";

export interface EventListParams {
  category?: "movies" | "sports" | "concerts" | "featured";
  page?:     number;
  limit?:    number;
}

/**
 * EventService — all HTTP calls for the events domain.
 * Pure HTTP adapter: no mapping, no business logic.
 */
export class EventService {
  // ── Events ────────────────────────────────────────────────────────────────

  static getEvents(params?: EventListParams) {
    if (params?.category && params.category !== "featured") {
      return api
        .get<ApiResponse<EventResponseDto[]>>(
          `/event/api/events/category/${params.category}`,
          { params: { page: params.page ?? 0, limit: params.limit ?? 10 } }
        )
        .then((res) => res.data.data);
    }
    return api
      .get<ApiResponse<EventResponseDto[]>>("/event/api/events/featured")
      .then((res) => res.data.data);
  }

  static getEventById(id: number | string) {
    return api
      .get<ApiResponse<EventResponseDto>>(`/event/api/events/${id}`)
      .then((res) => res.data.data);
  }

  static createEvent(data: EventRequestDto) {
    return api
      .post<ApiResponse<EventResponseDto>>("/event/api/events", data)
      .then((res) => res.data.data);
  }

  static updateEvent(id: number | string, data: Partial<EventRequestDto>) {
    return api
      .put<ApiResponse<EventResponseDto>>(`/event/api/events/${id}`, data)
      .then((res) => res.data.data);
  }

  static deleteEvent(id: number | string) {
    return api
      .delete<ApiResponse<void>>(`/event/api/events/${id}`)
      .then((res) => res.data);
  }

  // ── Admin — All events (no category filter) ───────────────────────────────

  static getAllEvents() {
    return api
      .get<ApiResponse<EventResponseDto[]>>("/event/api/events")
      .then((res) => res.data.data);
  }

  // ── Venues (via event microservice) ──────────────────────────────────────

  static getVenues() {
    return api
      .get<ApiResponse<VenueResponseDto[]>>("/event/api/venues")
      .then((res) => res.data.data);
  }

  static getVenueById(id: number | string) {
    return api
      .get<ApiResponse<VenueResponseDto>>(`/event/api/venues/${id}`)
      .then((res) => res.data.data);
  }
}
