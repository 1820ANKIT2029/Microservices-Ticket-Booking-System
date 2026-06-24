import type { LocalSection, LocalSeat, SeatDTO, VenueSectionMapDTO } from "../types";

export function parseSection(s: VenueSectionMapDTO | any): LocalSection {
  return {
    id:          s.id,
    venueId:     s.venueId,
    name:        s.name,
    sectionType: s.sectionType ?? "STANDARD",
    x:           s.x        ?? 0,
    y:           s.y        ?? 0,
    width:       s.width    ?? 300,
    height:      s.height   ?? 200,
    rotation:    s.rotation ?? 0,
    seats:       (s.seats ?? []).map(parseSeat),
  };
}

export function parseSeat(seat: SeatDTO | any): LocalSeat {
  return {
    id:             seat.id,
    venueId:        seat.venueId,
    venueSectionId: seat.venueSectionId,
    rowLabel:       seat.rowLabel   ?? "A",
    seatNumber:     seat.seatNumber ?? "1",
    seatType:       (seat.seatType  ?? "STANDARD") as LocalSeat["seatType"],
    x:              seat.x        ?? 0,
    y:              seat.y        ?? 0,
    width:          seat.width    ?? 24,
    height:         seat.height   ?? 24,
    rotation:       seat.rotation ?? 0,
    shape:          ((seat.shape  ?? "circle") as LocalSeat["shape"]),
    isAccessible:   seat.isAccessible ?? false,
    isActive:       seat.isActive     ?? true,
  };
}
