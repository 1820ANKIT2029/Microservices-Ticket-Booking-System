"use client";

import { useQuery } from "@tanstack/react-query";
import { EventSessionService } from "../api/service";
import { sessionKeys } from "../query-keys";
import { toEventSessionList } from "../mapper";
import type { EventSession } from "../types";


export function useSessions() {
  return useQuery<EventSession[]>({
    queryKey: sessionKeys.list(),
    queryFn:  async () => {
      const dtos = await EventSessionService.getSessions();
      return toEventSessionList(dtos);
    },
  });
}

export function useSessionsByEvent(eventId: string | number) {
  return useQuery<EventSession[]>({
    queryKey: sessionKeys.byEvent(eventId),
    queryFn:  async () => {
      const dtos = await EventSessionService.getSessionsByEvent(eventId);
      return toEventSessionList(dtos);
    },
    enabled: !!eventId,
  });
}
