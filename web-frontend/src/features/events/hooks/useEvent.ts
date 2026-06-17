"use client";

import { useQuery } from "@tanstack/react-query";
import { EventService } from "../api/service";
import { eventKeys } from "../query-keys";
import { toEvent } from "../mapper";
import type { Event } from "../types";

/**
 * Fetches a single event by ID.
 * Returns a typed domain Event — not a raw DTO.
 */
export function useEvent(eventId: string | number) {
  return useQuery<Event>({
    queryKey: eventKeys.detail(eventId),
    queryFn:  async () => {
      const dto = await EventService.getEventById(eventId);
      return toEvent(dto);
    },
    enabled: !!eventId,
  });
}
