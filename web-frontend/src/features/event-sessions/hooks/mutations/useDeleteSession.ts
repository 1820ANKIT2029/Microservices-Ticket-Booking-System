import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventSessionService } from "@/features/event-sessions/services/event-session.service";
import { queryKeys } from "@/shared/hooks/keys";

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => EventSessionService.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eventSessions.all });
    },
  });
}
