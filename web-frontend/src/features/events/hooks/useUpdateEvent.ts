"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventService } from "../api/service";
import { eventKeys } from "../query-keys";
import { toEvent } from "../mapper";
import type { EventRequestDto } from "../types";

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<EventRequestDto> }) =>
      EventService.updateEvent(id, data).then(toEvent),

    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(updated.id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}
