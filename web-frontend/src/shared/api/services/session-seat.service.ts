import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import type { SessionSeatDTO } from "@/features/venue-seat-map/types";

/**
 * SessionSeatService — centralized HTTP calls for session seats.
 */
export class SessionSeatService {
  static getSessionSeats(eventSessionId: number | string) {
    return api
      .get<ApiResponse<SessionSeatDTO[]>>(`/inventory/api/event-sessions/${eventSessionId}/session-seats`)
      .then((res) => res.data.data);
  }
}
