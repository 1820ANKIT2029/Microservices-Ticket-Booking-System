// Events feature public API
export { EventService } from "./services/event.service";
export { useEvent } from "./hooks/queries/useEvent";
export { useEvents } from "./hooks/queries/useEvents";
export type { EventCategory, UnifiedEvent } from "./hooks/queries/useEvents";
export { useCreateEvent } from "./hooks/mutations/useCreateEvent";
export type { EventDTO, Movie, SportsMatch, Concert } from "./types";
