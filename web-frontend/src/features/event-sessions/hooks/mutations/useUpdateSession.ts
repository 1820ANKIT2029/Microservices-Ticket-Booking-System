import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventSessionService } from "@/features/event-sessions/services/event-session.service";
import { queryKeys } from "@/shared/hooks/keys";
import { EventSessionDTO } from "@/features/events/types";

export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<EventSessionDTO> }) =>
      EventSessionService.updateSession(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eventSessions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.eventSessions.detail(variables.id) });
    },
  });
}
