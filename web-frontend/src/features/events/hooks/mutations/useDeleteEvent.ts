import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventService } from "@/features/events/services/event.service";
import { queryKeys } from "@/shared/hooks/keys";

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => EventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
}
