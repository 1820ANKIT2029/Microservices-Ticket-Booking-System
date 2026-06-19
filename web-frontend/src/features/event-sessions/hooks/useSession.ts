"use client";

import { useQuery } from "@tanstack/react-query";
import { EventSessionService } from "../api/service";
import { sessionKeys } from "../query-keys";
import { toEventSession } from "../mapper";
import type { EventSession } from "../types";

export function useSession(eventId: string | number, sessionId: string | number) {
  return useQuery<EventSession>({
    queryKey: sessionKeys.detail(sessionId),
    queryFn:  async () => {
      const dto = await EventSessionService.getSessionById(eventId, sessionId);
      return toEventSession(dto);
    },
    enabled: !!eventId && !!sessionId,
  });
}
