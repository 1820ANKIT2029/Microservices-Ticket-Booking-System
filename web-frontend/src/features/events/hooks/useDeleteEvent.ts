"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventService } from "../api/service";
import { eventKeys } from "../query-keys";

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => EventService.deleteEvent(id),

    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}
