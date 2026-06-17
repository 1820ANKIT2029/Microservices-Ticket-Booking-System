import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import type { VenueResponseDto, VenueRequestDto } from "@/features/events/types";

/**
 * AdminService — HTTP calls for admin management screens.
 * Venue CRUD is co-located here (not in venue-seat-map which handles the canvas).
 */
export class AdminService {
  // ── Venues ────────────────────────────────────────────────────────────────

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

  static createVenue(data: VenueRequestDto) {
    return api
      .post<ApiResponse<VenueResponseDto>>("/event/api/venues", data)
      .then((res) => res.data.data);
  }

  static updateVenue(id: number | string, data: Partial<VenueRequestDto>) {
    return api
      .put<ApiResponse<VenueResponseDto>>(`/event/api/venues/${id}`, data)
      .then((res) => res.data.data);
  }

  static deleteVenue(id: number | string) {
    return api
      .delete<ApiResponse<void>>(`/event/api/venues/${id}`)
      .then((res) => res.data);
  }
}
