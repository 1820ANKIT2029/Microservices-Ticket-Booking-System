import { useQuery } from "@tanstack/react-query";
import { EventService } from "../../services/event.service";
import { queryKeys } from "@/shared/hooks/keys";
import { EventDTO } from "../../types";

export function useEvent(eventId: string | number) {
  return useQuery<EventDTO>({
    queryKey: queryKeys.events.detail(String(eventId)),
    queryFn: () => EventService.getEventById(eventId).then((res) => res.data.data),
    enabled: !!eventId,
  });
}
