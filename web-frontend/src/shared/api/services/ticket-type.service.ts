import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import type { TicketTypeRequestDto, TicketTypeResponseDto } from "@/features/events/types";

/**
 * TicketTypeService — centralized HTTP calls for ticket types linked to event sessions.
 */
export class TicketTypeService {
  static createTicketType(eventSessionId: number | string, data: TicketTypeRequestDto) {
    return api
      .post<ApiResponse<TicketTypeResponseDto>>(`/event/api/event-sessions/${eventSessionId}/ticket-type`, data)
      .then((res) => res.data.data);
  }

  static updateTicketType(eventSessionId: number | string, ticketTypeId: number | string, data: Partial<TicketTypeRequestDto>) {
    return api
      .put<ApiResponse<TicketTypeResponseDto>>(`/event/api/event-sessions/${eventSessionId}/ticket-type/${ticketTypeId}`, data)
      .then((res) => res.data.data);
  }

  static deleteTicketType(eventSessionId: number | string, ticketTypeId: number | string) {
    return api
      .delete<ApiResponse<void>>(`/event/api/event-sessions/${eventSessionId}/ticket-type/${ticketTypeId}`)
      .then((res) => res.data);
  }

  static getTicketTypesBySession(eventSessionId: number | string) {
    return api
      .get<ApiResponse<TicketTypeResponseDto[]>>(`/event/api/event-sessions/${eventSessionId}/ticket-type`)
      .then((res) => res.data.data);
  }
}
