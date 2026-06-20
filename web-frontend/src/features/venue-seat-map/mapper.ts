import type {
  VenueMapDTO,
  VenueSectionMapDTO,
  SeatDTO,
  LocalVenue,
  LocalSection,
  LocalSeat,
} from "./types";

/**
 * Converts a VenueMapDTO + sections array into the editor LocalVenue model.
 */
export function toLocalVenue(
  dto: VenueMapDTO,
  sections?: VenueSectionMapDTO[]
): LocalVenue {
  const sectionsData = dto.sections && dto.sections.length > 0
    ? dto.sections
    : (sections || []);

  return {
    id:        dto.id,
    name:      dto.name,
    mapWidth:  dto.mapWidth  ?? 1200,
    mapHeight: dto.mapHeight ?? 800,
    sections:  (Array.isArray(sectionsData) ? sectionsData : []).map(toLocalSection),
  };
}

/**
 * Converts a VenueSectionMapDTO to the editor LocalSection model.
 * All nullable fields are given safe defaults so the canvas never crashes.
 */
export function toLocalSection(dto: VenueSectionMapDTO): LocalSection {
  return {
    id:          dto.id,
    venueId:     dto.venueId,
    name:        dto.name,
    sectionType: dto.sectionType ?? "STANDARD",
    x:           dto.x        ?? 0,
    y:           dto.y        ?? 0,
    width:       dto.width    ?? 300,
    height:      dto.height   ?? 200,
    rotation:    dto.rotation ?? 0,
    seats:       (dto.seats ?? []).map(toLocalSeat),
  };
}

/**
 * Converts a SeatDTO (from backend) to a LocalSeat (editor canvas model).
 * All nullable fields are given safe defaults so the canvas never crashes.
 */
export function toLocalSeat(dto: SeatDTO): LocalSeat {
  return {
    id:             dto.id,
    venueId:        dto.venueId,
    venueSectionId: dto.venueSectionId,
    rowLabel:       dto.rowLabel   ?? "A",
    seatNumber:     dto.seatNumber ?? "1",
    seatType:       (dto.seatType  ?? "STANDARD") as LocalSeat["seatType"],
    x:              dto.x        ?? 0,
    y:              dto.y        ?? 0,
    width:          dto.width    ?? 24,
    height:         dto.height   ?? 24,
    rotation:       dto.rotation ?? 0,
    shape:          (dto.shape   ?? "circle") as LocalSeat["shape"],
    isAccessible:   dto.isAccessible ?? false,
    isActive:       dto.isActive     ?? true,
  };
}
