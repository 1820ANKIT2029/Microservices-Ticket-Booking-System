"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VenueSeatMapService } from "../api/service";
import { venueSeatMapKeys } from "../query-keys";
import { toLocalVenue, toLocalSection, toLocalSeat } from "../mapper";
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
        VenueSeatMapService.getSections(venueId),
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

export function useSeatsBySection(sectionId: number | string) {
  return useQuery<SeatDTO[]>({
    queryKey: venueSeatMapKeys.seats(sectionId),
    queryFn:  () => VenueSeatMapService.getSeatsBySection(sectionId),
    enabled:  !!sectionId,
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
      VenueSeatMapService.updateSection(id, payload).then(toLocalSection),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueSeatMapKeys.sections(venueId) });
    },
  });
}

export function useDeleteSection(venueId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => VenueSeatMapService.deleteSection(id),

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

export function useCreateSeatsBatch(sectionId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payloads: CreateSeatPayload[]) =>
      VenueSeatMapService.createSeatsBatch(payloads),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueSeatMapKeys.seats(sectionId) });
    },
  });
}

export function useUpdateSeat(sectionId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSeatPayload }) =>
      VenueSeatMapService.updateSeat(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueSeatMapKeys.seats(sectionId) });
    },
  });
}

export function useDeleteSeat(sectionId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => VenueSeatMapService.deleteSeat(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueSeatMapKeys.seats(sectionId) });
    },
  });
}
