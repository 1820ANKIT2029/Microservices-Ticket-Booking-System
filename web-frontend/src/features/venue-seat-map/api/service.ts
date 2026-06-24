import { VenueService, SessionSeatService, BookingService } from "@/shared/api/services";
import type { VenueRequestDto } from "@/features/events/types";
import type {
  CreateVenueSectionPayload,
  UpdateVenueSectionPayload,
  CreateSeatPayload,
  UpdateSeatPayload,
} from "../types";

/**
 * VenueSeatMapService — Legacy wrapper mapping to centralized API services.
 */
export class VenueSeatMapService {
  static getVenueById(id: number | string) { return VenueService.getVenueById(id); }
  static createVenue(data: VenueRequestDto) { return VenueService.createVenue(data); }
  static updateVenue(id: number | string, data: Partial<VenueRequestDto>) { return VenueService.updateVenue(id, data); }
  static deleteVenue(id: number | string) { return VenueService.deleteVenue(id); }

  static getVenue(venueId: number | string) { return VenueService.getVenue(venueId); }
  static updateVenueMetadata(venueId: number | string, name: string, mapWidth: number, mapHeight: number) {
    return VenueService.updateVenueMetadata(venueId, name, mapWidth, mapHeight);
  }

  static getSections(venueId: number | string) { return VenueService.getSections(venueId); }
  static createSection(payload: CreateVenueSectionPayload) { return VenueService.createSection(payload); }
  static updateSection(venueId: number | string, id: number, payload: UpdateVenueSectionPayload) { return VenueService.updateSection(venueId, id, payload); }
  static deleteSection(venueId: number | string, id: number) { return VenueService.deleteSection(venueId, id); }

  static getSeatsBySection(venueId: number | string, sectionId: number | string) { return VenueService.getSeatsBySection(venueId, sectionId); }
  static createSeat(payload: CreateSeatPayload) { return VenueService.createSeat(payload); }
  static createSeatsBatch(venueId: number | string, sectionId: number | string, payloads: CreateSeatPayload[]) { return VenueService.createSeatsBatch(venueId, sectionId, payloads); }
  static updateSeat(venueId: number | string, sectionId: number | string, id: number, payload: UpdateSeatPayload) { return VenueService.updateSeat(venueId, sectionId, id, payload); }
  static deleteSeat(venueId: number | string, sectionId: number | string, id: number) { return VenueService.deleteSeat(venueId, sectionId, id); }

  static getSessionSeats(eventSessionId: number | string) { return SessionSeatService.getSessionSeats(eventSessionId); }

  static createEventBooking(booking: any) { return BookingService.createBooking(booking); }
}
