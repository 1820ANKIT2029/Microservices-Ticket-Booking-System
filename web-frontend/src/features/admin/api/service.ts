import { VenueService } from "@/shared/api/services";
import type { VenueRequestDto } from "@/features/events/types";

export class AdminService {
  static getVenues() { return VenueService.getVenues(); }
  static getVenueById(id: number | string) { return VenueService.getVenueById(id); }
  static createVenue(data: VenueRequestDto) { return VenueService.createVenue(data); }
  static updateVenue(id: number | string, data: Partial<VenueRequestDto>) { return VenueService.updateVenue(id, data); }
  static deleteVenue(id: number | string) { return VenueService.deleteVenue(id); }
}
