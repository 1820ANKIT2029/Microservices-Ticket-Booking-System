import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventSessionService } from "@/features/event-sessions/services/event-session.service";
import { queryKeys } from "@/shared/hooks/keys";
import { EventSessionDTO } from "@/features/events/types";

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<EventSessionDTO>) => EventSessionService.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eventSessions.all });
    },
  });
}
