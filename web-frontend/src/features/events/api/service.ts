import { EventService as SharedEventService, TicketTypeService, VenueService } from "@/shared/api/services";
import type { EventRequestDto, TicketTypeRequestDto, PerformerRequestDto, PerformerResponseDto } from "../types";

export interface EventListParams {
  category?: "movies" | "sports" | "concerts" | "featured";
  page?:     number;
  limit?:    number;
}

/**
 * EventService — Legacy wrapper mapping to centralized API services.
 */
export class EventService {
  static getEvents(params?: EventListParams) { return SharedEventService.getEvents(params); }
  static getEventById(id: number | string) { return SharedEventService.getEventById(id); }
  static createEvent(data: EventRequestDto, userId?: string) { return SharedEventService.createEvent(data, userId); }
  static updateEvent(id: number | string, data: Partial<EventRequestDto>, userId?: string) { return SharedEventService.updateEvent(id, data, userId); }
  static deleteEvent(id: number | string, userId?: string) { return SharedEventService.deleteEvent(id, userId); }
  static getAllEvents(page = 0, size = 10, userId?: string) { return SharedEventService.getAllEvents(page, size, userId); }

  static createTicketType(eventSessionId: number | string, data: TicketTypeRequestDto) { return TicketTypeService.createTicketType(eventSessionId, data); }
  static updateTicketType(eventSessionId: number | string, ticketTypeId: number | string, data: Partial<TicketTypeRequestDto>) { return TicketTypeService.updateTicketType(eventSessionId, ticketTypeId, data); }
  static deleteTicketType(eventSessionId: number | string, ticketTypeId: number | string) { return TicketTypeService.deleteTicketType(eventSessionId, ticketTypeId); }
  static getTicketTypesBySession(eventSessionId: number | string) { return TicketTypeService.getTicketTypesBySession(eventSessionId); }

  static getVenues() { return VenueService.getVenues(); }
  static getVenueById(id: number | string) { return VenueService.getVenueById(id); }

  static createPerformer(data: PerformerRequestDto) { return SharedEventService.createPerformer(data); }
  static linkPerformersToEvent(eventId: number, performers: PerformerResponseDto[]) { return SharedEventService.linkPerformersToEvent(eventId, performers); }
}
