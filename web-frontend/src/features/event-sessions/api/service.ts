import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import type { EventSessionResponseDto, EventSessionRequestDto } from "../types";

/**
 * EventSessionService — all HTTP calls for the event-sessions domain.
 */
export class EventSessionService {
  static getSessions() {
    return api
      .get<ApiResponse<EventSessionResponseDto[]>>("/event/api/event-session")
      .then((res) => res.data.data);
  }

  static getSessionById(id: number | string) {
    return api
      .get<ApiResponse<EventSessionResponseDto>>(`/event/api/event-session/${id}`)
      .then((res) => res.data.data);
  }

  static getSessionsByEvent(eventId: number | string) {
    return api
      .get<ApiResponse<EventSessionResponseDto[]>>(`/event/api/event-session?eventId=${eventId}`)
      .then((res) => res.data.data);
  }

  static createSession(data: EventSessionRequestDto) {
    return api
      .post<ApiResponse<EventSessionResponseDto>>("/event/api/event-session", data)
      .then((res) => res.data.data);
  }

  static updateSession(id: number | string, data: Partial<EventSessionRequestDto>) {
    return api
      .put<ApiResponse<EventSessionResponseDto>>(`/event/api/event-session/${id}`, data)
      .then((res) => res.data.data);
  }

  static deleteSession(id: number | string) {
    return api
      .delete<ApiResponse<void>>(`/event/api/event-session/${id}`)
      .then((res) => res.data);
  }
}
