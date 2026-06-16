import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventService } from "@/features/events/services/event.service";
import { queryKeys } from "@/shared/hooks/keys";
import { EventDTO } from "@/features/events/types";

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<EventDTO>) => EventService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
}
