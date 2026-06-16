import { useQuery } from "@tanstack/react-query";
import { EventService } from "@/features/events/services/event.service";
import { queryKeys } from "@/shared/hooks/keys";

export function useAdminEvent(id: string | number) {
  return useQuery({
    queryKey: queryKeys.events.detail(String(id)),
    queryFn: async () => {
      const res = await EventService.getEventById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}
