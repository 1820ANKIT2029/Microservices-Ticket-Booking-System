/**
 * Admin feature — public API.
 */
export { AdminService } from "./api/service";
export {
  useAdminVenues,
  useAdminVenue,
  useCreateVenue,
  useUpdateVenue,
  useDeleteVenue,
} from "./hooks/useAdminVenueQueries";
export { adminKeys } from "./query-keys";
export { venueRequestSchema } from "./schemas/venue.schema";
export type { VenueRequestFormData } from "./schemas/venue.schema";

// Types and Mappers for admin are re-used from the events domain
// as they are intrinsically linked to the same service definitions.
export type { Venue, VenueRequestDto, VenueResponseDto } from "@/features/events/types";
export { toVenue } from "@/features/events/mapper";
