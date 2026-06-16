import { useQuery } from "@tanstack/react-query";
import { EventService } from "@/features/events/services/event.service";
import { queryKeys } from "@/shared/hooks/keys";

export function useAdminEvents() {
  return useQuery({
    queryKey: queryKeys.events.list({ type: "admin" }),
    queryFn: async () => {
      const res = await EventService.getEvents();
      return res.data.data;
    },
  });
}
