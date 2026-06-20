"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VenueSeatMapService } from "../api/service";
import { venueSeatMapKeys, venueKeys } from "../query-keys";
import { toLocalVenue, toLocalSection } from "../mapper";
import { toVenue } from "@/features/events/mapper";
import type { Venue, VenueRequestDto } from "@/features/events/types";
import type {
  LocalVenue,
  LocalSection,
  SeatDTO,
  CreateVenueSectionPayload,
  UpdateVenueSectionPayload,
  CreateSeatPayload,
  UpdateSeatPayload,
} from "../types";

// ── Queries ───────────────────────────────────────────────────────────────────

/**
 * Loads a venue and its sections from the backend, merging them into a
 * LocalVenue editor model.
 */
export function useVenue(venueId: number | string) {
  return useQuery<LocalVenue>({
    queryKey: venueSeatMapKeys.venue(venueId),
    queryFn:  async () => {
      const [venue, sections] = await Promise.all([
        VenueSeatMapService.getVenue(venueId),
        VenueSeatMapService.getSections(venueId).catch(() => []),
      ]);
      return toLocalVenue(venue, sections);
    },
    enabled: !!venueId,
  });
}

export function useSections(venueId: number | string) {
  return useQuery<LocalSection[]>({
    queryKey: venueSeatMapKeys.sections(venueId),
    queryFn:  async () => {
      const dtos = await VenueSeatMapService.getSections(venueId);
      return dtos.map(toLocalSection);
    },
    enabled: !!venueId,
  });
}

export function useSeatsBySection(venueId: number | string, sectionId: number | string) {
  return useQuery<SeatDTO[]>({
    queryKey: venueSeatMapKeys.seats(sectionId),
    queryFn:  () => VenueSeatMapService.getSeatsBySection(venueId, sectionId),
    enabled:  !!sectionId && !!venueId,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateSection(venueId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVenueSectionPayload) =>
      VenueSeatMapService.createSection(payload).then(toLocalSection),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueSeatMapKeys.sections(venueId) });
      queryClient.invalidateQueries({ queryKey: venueSeatMapKeys.venue(venueId) });
    },
  });
}

export function useUpdateSection(venueId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateVenueSectionPayload }) =>
      VenueSeatMapService.updateSection(venueId, id, payload).then(toLocalSection),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueSeatMapKeys.sections(venueId) });
    },
  });
}

export function useDeleteSection(venueId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => VenueSeatMapService.deleteSection(venueId, id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueSeatMapKeys.sections(venueId) });
      queryClient.invalidateQueries({ queryKey: venueSeatMapKeys.venue(venueId) });
    },
  });
}

export function useCreateSeat(sectionId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSeatPayload) => VenueSeatMapService.createSeat(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueSeatMapKeys.seats(sectionId) });
    },
  });
}

export function useCreateSeatsBatch(venueId: number | string, sectionId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payloads: CreateSeatPayload[]) =>
      VenueSeatMapService.createSeatsBatch(venueId, sectionId, payloads),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueSeatMapKeys.seats(sectionId) });
    },
  });
}

export function useUpdateSeat(venueId: number | string, sectionId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSeatPayload }) =>
      VenueSeatMapService.updateSeat(venueId, sectionId, id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueSeatMapKeys.seats(sectionId) });
    },
  });
}

export function useDeleteSeat(venueId: number | string, sectionId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => VenueSeatMapService.deleteSeat(venueId, sectionId, id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueSeatMapKeys.seats(sectionId) });
    },
  });
}

// ── Venue CRUD Hooks (Consolidated from admin) ────────────────────────────────

export function useAdminVenues() {
  return useQuery<Venue[]>({
    queryKey: venueKeys.list(),
    queryFn:  async () => {
      const dtos = await VenueSeatMapService.getVenues();
      return dtos.map(toVenue);
    },
  });
}

export function useAdminVenue(id: string | number) {
  return useQuery<Venue>({
    queryKey: venueKeys.detail(id),
    queryFn:  async () => {
      const dto = await VenueSeatMapService.getVenueById(id);
      return toVenue(dto);
    },
    enabled: !!id,
  });
}

export function useCreateVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VenueRequestDto) =>
      VenueSeatMapService.createVenue(data).then(toVenue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueKeys.all });
    },
  });
}

export function useUpdateVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<VenueRequestDto> }) =>
      VenueSeatMapService.updateVenue(id, data).then(toVenue),

    onSuccess: (venue) => {
      queryClient.invalidateQueries({ queryKey: venueKeys.detail(venue.id) });
      queryClient.invalidateQueries({ queryKey: venueKeys.list() });
    },
  });
}

export function useDeleteVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => VenueSeatMapService.deleteVenue(id),

    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: venueKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: venueKeys.list() });
    },
  });
}
