import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import type { VenueResponseDto, VenueRequestDto } from "@/features/events/types";
import type {
  VenueMapDTO,
  VenueSectionMapDTO,
  SeatDTO,
  CreateVenueSectionPayload,
  UpdateVenueSectionPayload,
  CreateSeatPayload,
  UpdateSeatPayload,
} from "@/features/venue-seat-map/types";
import type { PageVenueSearchResponse } from "@/features/search/types";

/**
 * VenueService — centralized HTTP calls for venues, sections, and seats.
 */
export class VenueService {

  // ── Admin Venue CRUD ──────────────────────────────────────────────────────

  static getVenueById(id: number | string) {
    return api
      .get<ApiResponse<VenueResponseDto>>(`/inventory/api/venues/${id}`)
      .then((res) => res.data.data);
  }

  static createVenue(data: VenueRequestDto) {
    return api
      .post<ApiResponse<VenueResponseDto>>("/inventory/api/venues", data)
      .then((res) => res.data.data);
  }

  static updateVenue(id: number | string, data: Partial<VenueRequestDto>) {
    return api
      .put<ApiResponse<VenueResponseDto>>(`/inventory/api/venues/${id}`, data)
      .then((res) => res.data.data);
  }

  static deleteVenue(id: number | string) {
    return api
      .delete<ApiResponse<void>>(`/inventory/api/venues/${id}`)
      .then((res) => res.data);
  }

  // ── Venue Search & List ───────────────────────────────────────────────────

  static searchVenues(keyword?: string, page = 0, size = 10, sort?: string[]) {
    return api
      .get<ApiResponse<PageVenueSearchResponse>>("/inventory/api/venues/search", {
        params: { keyword, page, size, sort: sort?.join(",") },
      })
      .then((res) => res.data.data);
  }

  static getVenues() {
    return api
      .get<ApiResponse<any>>("/inventory/api/venues/search", {
        params: { page: 0, size: 100 }
      })
      .then(async (res) => {
        const content = res.data.data.content || [];
        const details = await Promise.all(
          content.map((item: any) => VenueService.getVenueById(item.id))
        );
        return details;
      });
  }

  // ── Venue Canvas Editor ───────────────────────────────────────────────────

  static getVenue(venueId: number | string) {
    return api
      .get<ApiResponse<VenueMapDTO>>(`/inventory/api/venues/${venueId}`)
      .then((res) => res.data.data);
  }

  static async updateVenueMetadata(venueId: number | string, name: string, mapWidth: number, mapHeight: number) {
    const res = await api.get(`/inventory/api/venues/${venueId}`);
    const fullVenue = res.data.data;

    const updated = {
      ...fullVenue,
      name,
      mapWidth,
      mapHeight,
    };

    const putRes = await api.put(`/inventory/api/venues/${venueId}`, updated);
    return putRes.data.data;
  }

  // ── Venue Sections ────────────────────────────────────────────────────────

  static getSections(venueId: number | string) {
    return api
      .get<ApiResponse<VenueSectionMapDTO[]>>(`/inventory/api/venues/${venueId}/venue-sections`)
      .then((res) => res.data.data);
  }

  static createSection(payload: CreateVenueSectionPayload) {
    return api
      .post<ApiResponse<VenueSectionMapDTO>>(`/inventory/api/venues/${payload.venueId}/venue-sections`, payload)
      .then((res) => res.data.data);
  }

  static updateSection(venueId: number | string, id: number, payload: UpdateVenueSectionPayload) {
    return api
      .put<ApiResponse<VenueSectionMapDTO>>(`/inventory/api/venues/${venueId}/venue-sections/${id}`, payload)
      .then((res) => res.data.data);
  }

  static deleteSection(venueId: number | string, id: number) {
    return api
      .delete<ApiResponse<void>>(`/inventory/api/venues/${venueId}/venue-sections/${id}`)
      .then((res) => res.data);
  }

  // ── Seats ─────────────────────────────────────────────────────────────────

  static getSeatsBySection(venueId: number | string, sectionId: number | string) {
    return api
      .get<ApiResponse<SeatDTO[]>>(`/inventory/api/venues/${venueId}/venue-sections/${sectionId}/seats`)
      .then((res) => res.data.data);
  }

  static createSeat(payload: CreateSeatPayload) {
    return api
      .post<ApiResponse<SeatDTO>>(`/inventory/api/venues/${payload.venueId}/venue-sections/${payload.venueSectionId}/seats`, payload)
      .then((res) => res.data.data);
  }

  static createSeatsBatch(venueId: number | string, sectionId: number | string, payloads: CreateSeatPayload[]) {
    return api
      .post<ApiResponse<SeatDTO[]>>(`/inventory/api/venues/${venueId}/venue-sections/${sectionId}/seats/batch`, payloads)
      .then((res) => res.data.data);
  }

  static updateSeat(venueId: number | string, sectionId: number | string, id: number, payload: UpdateSeatPayload) {
    return api
      .put<ApiResponse<SeatDTO>>(`/inventory/api/venues/${venueId}/venue-sections/${sectionId}/seats/${id}`, payload)
      .then((res) => res.data.data);
  }

  static deleteSeat(venueId: number | string, sectionId: number | string, id: number) {
    return api
      .delete<ApiResponse<void>>(`/inventory/api/venues/${venueId}/venue-sections/${sectionId}/seats/${id}`)
      .then((res) => res.data);
  }
}
