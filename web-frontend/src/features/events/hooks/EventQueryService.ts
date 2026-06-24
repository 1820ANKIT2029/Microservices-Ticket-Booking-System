import { BaseQueryService } from "@/shared/hooks/BaseQueryService";
import { EventService } from "@/shared/api/services";
import type { EventResponseDto } from "../types";
import { useQuery } from "@tanstack/react-query";
import { toEvent } from "../mapper";

export class EventQueryService extends BaseQueryService<EventResponseDto> {
  constructor() {
    super(EventService as any, "events");
  }

  public useEvent(eventId: string | number | null | undefined) {
    return useQuery({
      queryKey: [this.queryKey, "detail", "mapped", eventId],
      queryFn: async () => {
        const dto = await EventService.getEventById(eventId as any);
        return toEvent(dto);
      },
      enabled: !!eventId,
    });
  }

  public useEvents(params?: any) {
    const category = params?.category ?? "featured";
    const page      = params?.page ?? 0;
    const limit     = params?.limit ?? 10;

    return useQuery({
      queryKey: [this.queryKey, "category", category, page, limit],
      queryFn:  () => EventService.getEvents({ category, page, limit }),
    });
  }
}

export const eventQueries = new EventQueryService();
