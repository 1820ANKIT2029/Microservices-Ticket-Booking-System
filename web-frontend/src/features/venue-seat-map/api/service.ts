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
} from "../types";

/**
 * VenueSeatMapService — all HTTP calls for venues and the venue canvas editor.
 *
 * NOTE: Uses VenueMapDTO / VenueSectionMapDTO / SeatDTO — these are
 * canvas-specific projections, distinct from the admin-facing VenueResponseDto.
 * The shared ApiResponse<T> from @/shared/types is used — no local redeclaration.
 */
export class VenueSeatMapService {
  // ── Venue CRUD ─────────────────────────────────────────────────────────────

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

  // ── Venue Canvas ──────────────────────────────────────────────────────────

  static getVenue(venueId: number | string) {
    return api
      .get<ApiResponse<VenueMapDTO>>(`/event/api/venues/${venueId}`)
      .then((res) => res.data.data);
  }

  static async updateVenueMetadata(venueId: number | string, name: string, mapWidth: number, mapHeight: number) {
    // 1. Fetch full venue to prevent overwriting other fields (backend PUT replaces)
    const res = await api.get(`/event/api/venues/${venueId}`);
    const fullVenue = res.data.data;
    
    // 2. Update canvas fields
    const updated = {
      ...fullVenue,
      name,
      mapWidth,
      mapHeight,
    };
    
    // 3. Save back
    const putRes = await api.put(`/event/api/venues/${venueId}`, updated);
    return putRes.data.data;
  }

  // ── Sections ──────────────────────────────────────────────────────────────

  static getSections(venueId: number | string) {
    return api
      .get<ApiResponse<VenueSectionMapDTO[]>>(`/event/api/venues/${venueId}/venue-sections`)
      .then((res) => res.data.data);
  }

  static createSection(payload: CreateVenueSectionPayload) {
    return api
      .post<ApiResponse<VenueSectionMapDTO>>(`/event/api/venues/${payload.venueId}/venue-sections`, payload)
      .then((res) => res.data.data);
  }

  static updateSection(venueId: number | string, id: number, payload: UpdateVenueSectionPayload) {
    return api
      .put<ApiResponse<VenueSectionMapDTO>>(`/event/api/venues/${venueId}/venue-sections/${id}`, payload)
      .then((res) => res.data.data);
  }

  static deleteSection(venueId: number | string, id: number) {
    return api
      .delete<ApiResponse<void>>(`/event/api/venues/${venueId}/venue-sections/${id}`)
      .then((res) => res.data);
  }

  // ── Seats ──────────────────────────────────────────────────────────────────

  static getSeatsBySection(venueId: number | string, sectionId: number | string) {
    return api
      .get<ApiResponse<SeatDTO[]>>(`/event/api/venues/${venueId}/venue-sections/${sectionId}/seats`)
      .then((res) => res.data.data);
  }

  static createSeat(payload: CreateSeatPayload) {
    return api
      .post<ApiResponse<SeatDTO>>(`/event/api/venues/${payload.venueId}/venue-sections/${payload.venueSectionId}/seats`, payload)
      .then((res) => res.data.data);
  }

  static createSeatsBatch(venueId: number | string, sectionId: number | string, payloads: CreateSeatPayload[]) {
    return api
      .post<ApiResponse<SeatDTO[]>>(`/event/api/venues/${venueId}/venue-sections/${sectionId}/seats/batch`, payloads)
      .then((res) => res.data.data);
  }

  static updateSeat(venueId: number | string, sectionId: number | string, id: number, payload: UpdateSeatPayload) {
    return api
      .put<ApiResponse<SeatDTO>>(`/event/api/venues/${venueId}/venue-sections/${sectionId}/seats/${id}`, payload)
      .then((res) => res.data.data);
  }

  static deleteSeat(venueId: number | string, sectionId: number | string, id: number) {
    return api
      .delete<ApiResponse<void>>(`/event/api/venues/${venueId}/venue-sections/${sectionId}/seats/${id}`)
      .then((res) => res.data);
  }
}
