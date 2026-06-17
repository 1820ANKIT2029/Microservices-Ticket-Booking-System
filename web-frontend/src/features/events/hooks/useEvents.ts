"use client";

import { useQuery } from "@tanstack/react-query";
import { EventService } from "../api/service";
import type { EventListParams } from "../api/service";
import { eventKeys } from "../query-keys";
import { toEvent } from "../mapper";
import type { Event } from "../types";

/**
 * Fetches a list of events by category (or featured events by default).
 * Returns typed domain Event[] — not raw DTOs.
 */
export function useEvents(params?: EventListParams) {
  const category = params?.category ?? "featured";
  const page      = params?.page ?? 0;
  const limit     = params?.limit ?? 10;

  return useQuery<Event[]>({
    queryKey: eventKeys.byCategory(category, page, limit),
    queryFn:  async () => {
      const dtos = await EventService.getEvents({ category, page, limit });
      return dtos.map(toEvent);
    },
  });
}
