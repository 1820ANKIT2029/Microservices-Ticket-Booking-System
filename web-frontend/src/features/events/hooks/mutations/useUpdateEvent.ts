import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventService } from "@/features/events/services/event.service";
import { queryKeys } from "@/shared/hooks/keys";
import { EventDTO } from "@/features/events/types";

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<EventDTO> }) =>
      EventService.updateEvent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(String(variables.id)) });
    },
  });
}
