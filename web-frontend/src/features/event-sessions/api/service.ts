import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import type { EventSessionResponseDto, EventSessionRequestDto } from "../types";

/**
 * EventSessionService — all HTTP calls for the event-sessions domain.
 */
const MOCK_USER_HEADERS = { "X-User-Id": "1" };

export class EventSessionService {
  static getSessions() {
    return api
      .get<ApiResponse<EventSessionResponseDto[]>>("/event/api/event-session", { headers: MOCK_USER_HEADERS })
      .then((res) => res.data.data);
  }
  static getSessionsByEvent(eventId: number | string) {
    return api
      .get<ApiResponse<EventSessionResponseDto[]>>(`/event/api/events/${eventId}/event-session`)
      .then((res) => res.data.data);
  }

  static getSessionById(eventId: number | string, sessionId: number | string) {
    return api
      .get<ApiResponse<EventSessionResponseDto>>(`/event/api/events/${eventId}/event-session/${sessionId}`)
      .then((res) => res.data.data);
  }

  static createSession(eventId: number | string, data: EventSessionRequestDto) {
    return api
      .post<ApiResponse<EventSessionResponseDto>>(`/event/api/events/${eventId}/event-session`, data)
      .then((res) => res.data.data);
  }

  static updateSession(eventId: number | string, sessionId: number | string, data: Partial<EventSessionRequestDto>) {
    return api
      .put<ApiResponse<EventSessionResponseDto>>(`/event/api/events/${eventId}/event-session/${sessionId}`, data)
      .then((res) => res.data.data);
  }

  static deleteSession(eventId: number | string, sessionId: number | string) {
    return api
      .delete<ApiResponse<void>>(`/event/api/events/${eventId}/event-session/${sessionId}`)
      .then((res) => res.data);
  }
}
