"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventService } from "../api/service";
import { eventKeys } from "../query-keys";
import { toEvent } from "../mapper";
import type { EventRequestDto } from "../types";

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EventRequestDto) =>
      EventService.createEvent(data).then(toEvent),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}
