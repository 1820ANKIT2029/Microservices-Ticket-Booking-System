import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import { JwtUtils } from "@/shared/utils";
import { TOKEN_KEY } from "@/shared/constants";
import type {
  EventResponseDto,
  EventRequestDto,
  PerformerRequestDto,
  PerformerResponseDto,
} from "@/features/events/types";
import type { PageEventSearchResponse } from "@/features/search/types";

const MOCK_USER_HEADERS = { "X-User-Id": "1" };

function getHeaders(userId?: string) {
  let resolvedUserId = userId;
  if (!resolvedUserId && typeof window !== "undefined") {
    const token = localStorage.getItem("token") || localStorage.getItem(TOKEN_KEY);
    if (token) {
      resolvedUserId = JwtUtils.getUserIdFromToken(token) || undefined;
    }
  }
  return resolvedUserId ? { "X-User-Id": resolvedUserId } : MOCK_USER_HEADERS;
}

export interface EventListParams {
  category?: "movies" | "sports" | "concerts" | "featured";
  page?:     number;
  limit?:    number;
}

/**
 * EventService — centralized HTTP calls for the events domain.
 */
export class EventService {

  // ── Events CRUD ───────────────────────────────────────────────────────────

  static getEventById(id: number | string) {
    return api
      .get<ApiResponse<EventResponseDto>>(`/event/api/events/${id}`)
      .then((res) => res.data.data);
  }

  static createEvent(data: EventRequestDto, userId?: string) {
    return api
      .post<ApiResponse<EventResponseDto>>("/event/api/events", data, { headers: getHeaders(userId) })
      .then((res) => res.data.data);
  }

  static updateEvent(id: number | string, data: Partial<EventRequestDto>, userId?: string) {
    return api
      .put<ApiResponse<EventResponseDto>>(`/event/api/events/${id}`, data, { headers: getHeaders(userId) })
      .then((res) => res.data.data);
  }

  static deleteEvent(id: number | string, userId?: string) {
    return api
      .delete<ApiResponse<void>>(`/event/api/events/${id}`, { headers: getHeaders(userId) })
      .then((res) => res.data);
  }

  // ── Events List & Search ──────────────────────────────────────────────────

  static getEvents(params?: EventListParams) {
    if (params?.category === "featured") {
      return api
        .get<ApiResponse<any>>("/event/api/events/search", {
          params: { status: "PUBLISHED", page: 0, size: 100 }
        })
        .then((res) => {
          const content = res.data.data.content || [];
          return content
            .filter((item: any) => item.isFeatured)
            .map((item: any) => ({
              id: item.id,
              title: item.title,
              slug: item.slug,
              eventType: item.eventType,
              status: item.status,
              bannerUrl: item.bannerUrl,
              isFeatured: item.isFeatured,
            })) as EventResponseDto[];
        });
    }

    let eventType: string | undefined;
    if (params?.category) {
      if (params.category === "movies") eventType = "MOVIE";
      else if (params.category === "concerts") eventType = "CONCERT";
      else if (params.category === "sports") eventType = "SPORTS";
    }

    return api
      .get<ApiResponse<any>>("/event/api/events/search", {
        params: {
          eventType,
          status: "PUBLISHED",
          page: params?.page ?? 0,
          size: params?.limit ?? 10,
        }
      })
      .then((res) => {
        const content = res.data.data.content || [];
        return content.map((item: any) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          eventType: item.eventType,
          status: item.status,
          bannerUrl: item.bannerUrl,
          isFeatured: item.isFeatured,
        })) as EventResponseDto[];
      });
  }

  static searchEventsCatalog(keyword?: string, status?: string, eventType?: string, page = 0, size = 10, sort?: string[]) {
    return api
      .get<ApiResponse<PageEventSearchResponse>>("/event/api/events/search", {
        params: { keyword, status, eventType, page, size, sort: sort?.join(",") },
      })
      .then((res) => res.data.data);
  }

  static getAllEvents(page = 0, size = 10, userId?: string) {
    return api
      .get<ApiResponse<any>>("/event/api/events", {
        headers: getHeaders(userId),
        params: { page, size }
      })
      .then((res) => res.data.data);
  }

  // ── Performers ────────────────────────────────────────────────────────────

  static createPerformer(data: PerformerRequestDto) {
    return api
      .post<ApiResponse<PerformerResponseDto>>("/event/api/performers", data)
      .then((res) => res.data.data);
  }

  static async linkPerformersToEvent(eventId: number, performers: PerformerResponseDto[]) {
    const currentEvent = await this.getEventById(eventId);
    const updatedData: Partial<EventRequestDto> = {
      ...currentEvent,
      performers,
    };
    return this.updateEvent(eventId, updatedData);
  }
}
