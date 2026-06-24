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
  useAdminVenues,
  useAdminVenue,
  useCreateVenue,
  useUpdateVenue,
  useDeleteVenue,
} from "./hooks/useVenueSeatMapQueries";

// Canvas editor hook (local reducer state — not TanStack Query)
export { useVenueEditor } from "./hooks/useVenueEditor";
export type { VenueEditorAPI } from "./hooks/useVenueEditor";

// Venue Components
export { VenueForm } from "@/features/events/components/VenueForm";
export { VenueTable } from "@/features/events/components/VenueTable";
export { SeatMapViewerPage } from "./components/viewer/SeatMapViewerPage";
export { SeatMapEditorPage } from "./components/editor/SeatMapEditorPage";

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
export { venueSeatMapKeys, venueKeys } from "./query-keys";
