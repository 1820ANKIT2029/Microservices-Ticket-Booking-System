import type {
  EventResponseDto,
  Event,
  PerformerResponseDto,
  Performer,
  EventSessionResponseDto,
  EventSession,
  TicketTypeResponseDto,
  TicketType,
  VenueResponseDto,
  Venue,
} from "./types";
import type { EventStatus, EventType } from "@/shared/constants";

// ── Performer ─────────────────────────────────────────────────────────────────

export function toPerformer(dto: PerformerResponseDto): Performer {
  return {
    id:          String(dto.id ?? ""),
    name:        dto.name ?? "",
    bio:         dto.bio ?? "",
    genre:       dto.genre ?? "",
    nationality: dto.nationality ?? "",
    websiteUrl:  dto.websiteUrl ?? "",
    imageUrl:    dto.imageUrl ?? "",
  };
}

// ── Session ───────────────────────────────────────────────────────────────────

export function toEventSession(dto: EventSessionResponseDto): EventSession {
  return {
    id:                String(dto.id ?? ""),
    eventId:           String(dto.eventId ?? ""),
    title:             dto.title ?? "",
    description:       dto.description ?? "",
    status:            dto.status ?? "SCHEDULED",
    sessionNumber:     dto.sessionNumber ?? 1,
    totalCapacity:     dto.totalCapacity ?? 0,
    availableCapacity: dto.availableCapacity ?? 0,
    startDateTime:     dto.startDateTime ?? dto.startDateTime ?? "",
    endDateTime:       dto.endDateTime ?? dto.endDateTime ?? "",
  };
}

// ── Ticket Type ───────────────────────────────────────────────────────────────

export function toTicketType(dto: TicketTypeResponseDto): TicketType {
  return {
    id:                String(dto.id ?? ""),
    name:              dto.name ?? "",
    description:       dto.description ?? "",
    basePrice:         dto.basePrice ?? 0,
    totalQuantity:     dto.totalQuantity ?? 0,
    availableQuantity: dto.availableQuantity ?? 0,
    maxPerBooking:     dto.maxPerBooking ?? 1,
    isActive:          dto.isActive ?? true,
    saleStartAt:       dto.saleStartAt ?? "",
    saleEndAt:         dto.saleEndAt ?? "",
  };
}

// ── Venue ─────────────────────────────────────────────────────────────────────

export function toVenue(dto: VenueResponseDto): Venue {
  return {
    id:            String(dto.id ?? ""),
    name:          dto.name ?? "",
    description:   dto.description ?? "",
    address:       dto.addressLine1 ?? "",
    city:          dto.city ?? "",
    state:         dto.state ?? "",
    country:       dto.country ?? "",
    postalCode:    dto.postalCode ?? "",
    totalCapacity: dto.totalCapacity ?? 0,
    timezone:      dto.timezone ?? "",
    websiteUrl:    dto.websiteUrl ?? "",
    isActive:      dto.isActive ?? true,
  };
}

// ── Event ─────────────────────────────────────────────────────────────────────

export function toEvent(dto: EventResponseDto): Event {
  return {
    id:             String(dto.id ?? ""),
    title:          dto.title ?? "",
    slug:           dto.slug ?? "",
    description:    dto.description ?? "",
    status:         (dto.status ?? "DRAFT") as EventStatus,
    eventType:      (dto.eventType ?? "OTHER") as EventType,
    venueId:        String(dto.venueId ?? ""),
    bannerUrl:      dto.bannerUrl ?? "",
    posterUrl:      dto.posterUrl ?? "",
    isFeatured:     dto.isFeatured ?? false,
    isMultiSession: dto.isMultiSession ?? false,
    createdAt:      dto.createdAt ?? "",
    updatedAt:      dto.updatedAt ?? "",
    performers:     (dto.performers ?? []).map(toPerformer),
    sessions:       (dto.sessions ?? []).map(toEventSession),
    ticketTypes:    (dto.ticketTypes ?? []).map(toTicketType),
  };
}

export function toEventList(dtos: EventResponseDto[]): Event[] {
  return dtos.map(toEvent);
}
