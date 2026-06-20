"use client";

import { useQuery } from "@tanstack/react-query";
import { EventService } from "../api/service";
import { eventKeys } from "../query-keys";
import { toEventList } from "../mapper";
import type { Event } from "../types";

/**
 * Fetches all events for admin management — no category filter.
 */
export function useAdminEvents() {
  return useQuery<Event[]>({
    queryKey: eventKeys.list(),
    queryFn:  async () => {
      const dtos = await EventService.getAllEvents();
      return toEventList(dtos);
    },
  });
}
