import { useQuery } from "@tanstack/react-query";
import { EventSessionService } from "@/features/event-sessions/services/event-session.service";
import { queryKeys } from "@/shared/hooks/keys";

export function useSessions() {
  return useQuery({
    queryKey: queryKeys.eventSessions.list(),
    queryFn: async () => {
      const res = await EventSessionService.getSessions();
      return res.data.data;
    },
  });
}
