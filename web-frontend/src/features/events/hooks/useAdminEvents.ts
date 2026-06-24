"use client";

import { useQuery } from "@tanstack/react-query";
import { EventService } from "../api/service";
import { eventKeys } from "../query-keys";
import { toEventList } from "../mapper";

/**
 * Fetches all events for admin/organizer management with pagination.
 */
export function useAdminEvents(page = 0, size = 10) {
  return useQuery({
    queryKey: [...eventKeys.list(), page, size],
    queryFn: async () => {
      const pageData = await EventService.getAllEvents(page, size);
      return {
        content: toEventList(pageData.content || []),
        totalPages: pageData.totalPages ?? 0,
        totalElements: pageData.totalElements ?? 0,
        size: pageData.size ?? size,
        number: pageData.number ?? page,
      };
    },
  });
}

