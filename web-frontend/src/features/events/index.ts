/**
 * Events feature — public API.
 * Import from "@/features/events" — never deep-import individual files.
 */

// Service
export { EventService }      from "./api/service";
export type { EventListParams } from "./api/service";

// Hooks
export { useEvents }       from "./hooks/useEvents";
export { useEvent }        from "./hooks/useEvent";
export { useAdminEvents }  from "./hooks/useAdminEvents";
export { useCreateEvent }  from "./hooks/useCreateEvent";
export { useUpdateEvent }  from "./hooks/useUpdateEvent";
export { useDeleteEvent }  from "./hooks/useDeleteEvent";

// Types
export type {
  // DTOs
  EventResponseDto,
  EventRequestDto,
  VenueResponseDto,
  VenueRequestDto,
  VenueSectionResponseDto,
  SeatResponseDto,
  TicketTypeResponseDto,
  TicketTypeRequestDto,
  PerformerResponseDto,
  EventSessionResponseDto,
  // Domain models
  Event,
  Venue,
  Performer,
  EventSession,
  TicketType,
  // @deprecated
  EventDTO,
} from "./types";

// Mapper
export { toEvent, toEventList, toVenue, toPerformer, toEventSession, toTicketType } from "./mapper";

// Query keys
export { eventKeys } from "./query-keys";

// Schemas
export { eventRequestSchema } from "./schemas/event.schema";
export type { EventRequestFormData } from "./schemas/event.schema";
