/**
 * Venue-seat-map feature — public API.
 */
// Service
export { VenueSeatMapService } from "./api/service";

// TanStack Query hooks
export {
  useVenue,
  useSections,
  useSeatsBySection,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useCreateSeat,
  useCreateSeatsBatch,
  useUpdateSeat,
  useDeleteSeat,
} from "./hooks/useVenueSeatMapQueries";

// Canvas editor hook (local reducer state — not TanStack Query)
export { useVenueEditor } from "./hooks/useVenueEditor";
export type { VenueEditorAPI } from "./hooks/useVenueEditor";

// Types
export type {
  VenueMapDTO,
  VenueSectionMapDTO,
  SeatDTO,
  CreateVenueSectionPayload,
  UpdateVenueSectionPayload,
  CreateSeatPayload,
  UpdateSeatPayload,
  LocalSeat,
  LocalSection,
  LocalVenue,
  SeatGenerationConfig,
  EditorState,
  ViewerState,
} from "./types";

// Mapper
export { toLocalVenue, toLocalSection, toLocalSeat } from "./mapper";

// Query keys
export { venueSeatMapKeys } from "./query-keys";
