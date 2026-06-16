import { useQuery } from "@tanstack/react-query";
import { EventSessionService } from "@/features/event-sessions/services/event-session.service";
import { queryKeys } from "@/shared/hooks/keys";

export function useSession(id: string | number) {
  return useQuery({
    queryKey: queryKeys.eventSessions.detail(id),
    queryFn: async () => {
      const res = await EventSessionService.getSessionById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}
