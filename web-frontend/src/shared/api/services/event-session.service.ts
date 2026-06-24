import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import { JwtUtils } from "@/shared/utils";
import { TOKEN_KEY } from "@/shared/constants";
import type { EventSessionResponseDto, EventSessionRequestDto } from "@/features/event-sessions/types";

const MOCK_USER_HEADERS = { "X-User-Id": "1" };

/**
 * EventSessionService — centralized HTTP calls for the event-sessions domain.
 */
export class EventSessionService {
  static getSessions(userId?: string, page = 0, size = 10, sort?: string[]) {
    let resolvedUserId = userId;
    if (!resolvedUserId && typeof window !== "undefined") {
      const token = localStorage.getItem("token") || localStorage.getItem(TOKEN_KEY);
      if (token) {
        resolvedUserId = JwtUtils.getUserIdFromToken(token) || undefined;
      }
    }
    const headers = resolvedUserId ? { "X-User-Id": resolvedUserId } : MOCK_USER_HEADERS;
    return api
      .get<ApiResponse<any>>("/event/api/event-sessions", {
        headers,
        params: { page, size, sort: sort?.join(",") },
      })
      .then((res) => {
        if (res.data.data && typeof res.data.data === "object" && "content" in res.data.data) {
          return res.data.data.content as EventSessionResponseDto[];
        }
        return res.data.data as EventSessionResponseDto[];
      });
  }

  static getSessionsByEvent(eventId: number | string) {
    return api
      .get<ApiResponse<EventSessionResponseDto[]>>(`/event/api/events/${eventId}/event-sessions`)
      .then((res) => res.data.data);
  }

  static getSessionById(eventId: number | string, sessionId: number | string) {
    return api
      .get<ApiResponse<EventSessionResponseDto>>(`/event/api/events/${eventId}/event-sessions/${sessionId}`)
      .then((res) => res.data.data);
  }

  static createSession(eventId: number | string, data: EventSessionRequestDto) {
    return api
      .post<ApiResponse<EventSessionResponseDto>>(`/event/api/events/${eventId}/event-sessions`, data)
      .then((res) => res.data.data);
  }

  static updateSession(eventId: number | string, sessionId: number | string, data: Partial<EventSessionRequestDto>) {
    return api
      .put<ApiResponse<EventSessionResponseDto>>(`/event/api/events/${eventId}/event-sessions/${sessionId}`, data)
      .then((res) => res.data.data);
  }

  static deleteSession(eventId: number | string, sessionId: number | string) {
    return api
      .delete<ApiResponse<void>>(`/event/api/events/${eventId}/event-sessions/${sessionId}`)
      .then((res) => res.data);
  }
}
