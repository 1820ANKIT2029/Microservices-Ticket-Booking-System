"use client";

import { api } from "@/shared/api";
import type {
  VenueMapDTO,
  VenueSectionMapDTO,
  SeatDTO,
  CreateVenueSectionPayload,
  UpdateVenueSectionPayload,
  CreateSeatPayload,
  UpdateSeatPayload,
} from "../types";

interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export const VenueSeatMapService = {
  // ── Venue ──────────────────────────────────────────────────────────────────

  getVenue: (venueId: number | string) =>
    api.get<ApiResponse<VenueMapDTO>>(`/event/api/venues/${venueId}`),

  // ── Sections ───────────────────────────────────────────────────────────────

  getSections: (venueId: number | string) =>
    api.get<ApiResponse<VenueSectionMapDTO[]>>(
      `/event/api/venue-sections?venueId=${venueId}`
    ),

  createSection: (payload: CreateVenueSectionPayload) =>
    api.post<ApiResponse<VenueSectionMapDTO>>(
      "/event/api/venue-sections",
      payload
    ),

  updateSection: (id: number, payload: UpdateVenueSectionPayload) =>
    api.put<ApiResponse<VenueSectionMapDTO>>(
      `/event/api/venue-sections/${id}`,
      payload
    ),

  deleteSection: (id: number) =>
    api.delete<ApiResponse<void>>(`/event/api/venue-sections/${id}`),

  // ── Seats ──────────────────────────────────────────────────────────────────

  getSeatsBySection: (sectionId: number | string) =>
    api.get<ApiResponse<SeatDTO[]>>(
      `/event/api/seats?venueSectionId=${sectionId}`
    ),

  createSeat: (payload: CreateSeatPayload) =>
    api.post<ApiResponse<SeatDTO>>("/event/api/seats", payload),

  createSeatsBatch: (payloads: CreateSeatPayload[]) =>
    api.post<ApiResponse<SeatDTO[]>>("/event/api/seats/batch", payloads),

  updateSeat: (id: number, payload: UpdateSeatPayload) =>
    api.put<ApiResponse<SeatDTO>>(`/event/api/seats/${id}`, payload),

  deleteSeat: (id: number) =>
    api.delete<ApiResponse<void>>(`/event/api/seats/${id}`),
};
