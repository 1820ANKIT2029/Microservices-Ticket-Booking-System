import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import type {
  EventResponseDto,
  EventRequestDto,
  VenueResponseDto,
  TicketTypeRequestDto,
  TicketTypeResponseDto,
  PerformerRequestDto,
  PerformerResponseDto,
} from "../types";

const MOCK_USER_HEADERS = { "X-User-Id": "1" };

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
      .post<ApiResponse<EventResponseDto>>("/event/api/events", data, { headers: MOCK_USER_HEADERS })
      .then((res) => res.data.data);
  }

  static updateEvent(id: number | string, data: Partial<EventRequestDto>) {
    return api
      .put<ApiResponse<EventResponseDto>>(`/event/api/events/${id}`, data, { headers: MOCK_USER_HEADERS })
      .then((res) => res.data.data);
  }

  static deleteEvent(id: number | string) {
    return api
      .delete<ApiResponse<void>>(`/event/api/events/${id}`, { headers: MOCK_USER_HEADERS })
      .then((res) => res.data);
  }

  // ── Ticket Types ──────────────────────────────────────────────────────────

  static createTicketType(data: TicketTypeRequestDto & { eventId: number; eventSessionId?: number }) {
    const { eventId, ...payload } = data;
    return api
      .post<ApiResponse<TicketTypeResponseDto>>("/event/api/ticket-type", payload, { params: { eventId } })
      .then((res) => res.data.data);
  }

  static updateTicketType(id: number | string, eventId: number, data: Partial<TicketTypeRequestDto>) {
    return api
      .put<ApiResponse<TicketTypeResponseDto>>(`/event/api/ticket-type/${id}`, data, { params: { eventId } })
      .then((res) => res.data.data);
  }

  static deleteTicketType(id: number | string, eventId: number) {
    return api
      .delete<ApiResponse<void>>(`/event/api/ticket-type/${id}`, { params: { eventId } })
      .then((res) => res.data);
  }

  // ── Admin — All events (no category filter) ───────────────────────────────

  static getAllEvents() {
    return api
      .get<ApiResponse<EventResponseDto[]>>("/event/api/events", { headers: MOCK_USER_HEADERS })
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

  // ── Performers ────────────────────────────────────────────────────────────

  static getAllPerformers(name: string) {
    return api
      .get<ApiResponse<PerformerResponseDto[]>>("/event/api/performers", { params: { name } })
      .then((res) => res.data.data);
  }

  static createPerformer(data: PerformerRequestDto) {
    return api
      .post<ApiResponse<PerformerResponseDto>>("/event/api/performers", data)
      .then((res) => res.data.data);
  }

  static async linkPerformersToEvent(eventId: number, performers: PerformerResponseDto[]) {
    // Fetch current event to retain all other fields
    const currentEvent = await this.getEventById(eventId);
    const updatedData: Partial<EventRequestDto> = {
      ...currentEvent,
      performers,
    };
    return this.updateEvent(eventId, updatedData);
  }
}
