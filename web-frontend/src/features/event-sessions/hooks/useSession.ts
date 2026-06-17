"use client";

import { useQuery } from "@tanstack/react-query";
import { EventSessionService } from "../api/service";
import { sessionKeys } from "../query-keys";
import { toEventSession } from "../mapper";
import type { EventSession } from "../types";

export function useSession(id: string | number) {
  return useQuery<EventSession>({
    queryKey: sessionKeys.detail(id),
    queryFn:  async () => {
      const dto = await EventSessionService.getSessionById(id);
      return toEventSession(dto);
    },
    enabled: !!id,
  });
}
