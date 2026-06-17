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
  sections: VenueSectionMapDTO[]
): LocalVenue {
  return {
    id:        dto.id,
    name:      dto.name,
    mapWidth:  dto.mapWidth,
    mapHeight: dto.mapHeight,
    sections:  sections.map(toLocalSection),
  };
}

/**
 * Converts a VenueSectionMapDTO to the editor LocalSection model.
 */
export function toLocalSection(dto: VenueSectionMapDTO): LocalSection {
  return {
    id:          dto.id,
    venueId:     dto.venueId,
    name:        dto.name,
    sectionType: dto.sectionType,
    x:           dto.x,
    y:           dto.y,
    width:       dto.width,
    height:      dto.height,
    rotation:    dto.rotation,
    seats:       (dto.seats ?? []).map(toLocalSeat),
  };
}

/**
 * Converts a SeatDTO (from backend) to a LocalSeat (editor canvas model).
 */
export function toLocalSeat(dto: SeatDTO): LocalSeat {
  return {
    id:            dto.id,
    venueId:       dto.venueId,
    venueSectionId: dto.venueSectionId,
    rowLabel:      dto.rowLabel,
    seatNumber:    dto.seatNumber,
    seatType:      dto.seatType as LocalSeat["seatType"],
    x:             dto.x,
    y:             dto.y,
    width:         dto.width,
    height:        dto.height,
    rotation:      dto.rotation,
    shape:         dto.shape,
    isAccessible:  dto.isAccessible,
    isActive:      dto.isActive,
  };
}
