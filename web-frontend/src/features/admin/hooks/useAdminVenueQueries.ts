"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminService } from "../api/service";
import { adminKeys } from "../query-keys";
import { toVenue } from "@/features/events/mapper";
import type { VenueRequestDto, Venue } from "@/features/events/types";

// ── Queries ───────────────────────────────────────────────────────────────────

export function useAdminVenues() {
  return useQuery<Venue[]>({
    queryKey: adminKeys.venues.list(),
    queryFn:  async () => {
      const dtos = await AdminService.getVenues();
      return dtos.map(toVenue);
    },
  });
}

export function useAdminVenue(id: string | number) {
  return useQuery<Venue>({
    queryKey: adminKeys.venues.detail(id),
    queryFn:  async () => {
      const dto = await AdminService.getVenueById(id);
      return toVenue(dto);
    },
    enabled: !!id,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VenueRequestDto) =>
      AdminService.createVenue(data).then(toVenue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.venues.all });
    },
  });
}

export function useUpdateVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<VenueRequestDto> }) =>
      AdminService.updateVenue(id, data).then(toVenue),

    onSuccess: (venue) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.venues.detail(venue.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.venues.list() });
    },
  });
}

export function useDeleteVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => AdminService.deleteVenue(id),

    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: adminKeys.venues.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.venues.list() });
    },
  });
}
