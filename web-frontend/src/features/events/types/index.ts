import type { ISODateString } from "@/shared/types";
import type { EventStatus, EventType } from "@/shared/constants";

// ── API DTOs (backend shapes) ─────────────────────────────────────────────────

export interface EventResponseDto {
  id:            number;
  title:         string;
  slug:          string;
  description?:  string;
  status?:       string;
  eventType?:    string;
  minAge?:       number;
  venueId:       number;
  bannerUrl?:    string;
  posterUrl?:    string;
  isMultiSession?: boolean;
  isFeatured?:   boolean;
  createdBy:     number;
  createdAt?:    ISODateString;
  updatedAt?:    ISODateString;
  performers?:   PerformerResponseDto[];
  sessions?:     EventSessionResponseDto[];
  ticketTypes?:  TicketTypeResponseDto[];
}

export interface EventRequestDto {
  title:          string;
  slug:           string;
  description?:   string;
  eventType?:     string;
  minAge?:        number;
  venueId:        number;
  bannerUrl?:     string;
  posterUrl?:     string;
  isMultiSession?: boolean;
  isFeatured?:    boolean;
  performers?:    PerformerResponseDto[];
}

export interface VenueResponseDto {
  id:            number;
  name:          string;
  description?:  string;
  addressLine1?: string;
  city?:         string;
  state?:        string;
  country?:      string;
  postalCode?:   string;
  longitude?:    number;
  latitude?:     number;
  timezone?:     string;
  totalCapacity?: number;
  websiteUrl?:   string;
  mapWidth?:     number;
  mapHeight?:    number;
  amenities?:    string;
  isActive?:     boolean;
  createdAt?:    ISODateString;
  sections?:     VenueSectionResponseDto[];
}

export interface VenueRequestDto {
  name:          string;
  description?:  string;
  addressLine1?: string;
  city?:         string;
  state?:        string;
  country?:      string;
  postalCode?:   string;
  longitude?:    number;
  latitude?:     number;
  timezone?:     string;
  totalCapacity?: number;
  websiteUrl?:   string;
  mapWidth?:     number;
  mapHeight?:    number;
  amenities?:    string;
}

export interface VenueSectionResponseDto {
  id?:           number;
  venueId?:      number;
  name:          string;
  description?:  string;
  sectionType?:  string;
  totalSeats?:   number;
  x?:            number;
  y?:            number;
  width?:        number;
  height?:       number;
  rotation?:     number;
  seats?:        SeatResponseDto[];
}

/** Renamed from SeatDTO to avoid collision with venue-seat-map canvas SeatDTO */
export interface SeatResponseDto {
  id?:           number;
  venueSectionId?: number;
  venueId?:      number;
  seatNumber:    string;
  rowLabel?:     string;
  seatType?:     string;
  x?:            number;
  y?:            number;
  width?:        number;
  height?:       number;
  rotation?:     number;
  shape?:        string;
  isAccessible?: boolean;
  isActive?:     boolean;
}

export interface TicketTypeResponseDto {
  id?:               number;
  eventId?:          number;
  eventSessionId?:   number;
  name:              string;
  description?:      string;
  basePrice:         number;
  totalQuantity:     number;
  availableQuantity: number;
  maxPerBooking:     number;
  isActive?:         boolean;
  saleStartAt?:      ISODateString;
  saleEndAt?:        ISODateString;
}

export interface TicketTypeRequestDto {
  name:              string;
  description?:      string;
  basePrice:         number;
  totalQuantity:     number;
  maxPerBooking:     number;
  saleStartAt?:      ISODateString;
  saleEndAt?:        ISODateString;
}

export interface PerformerResponseDto {
  id?:          number;
  name:         string;
  bio?:         string;
  genre?:       string;
  nationality?: string;
  websiteUrl?:  string;
  imageUrl?:    string;
  socialLink1?: string;
  socialLink2?: string;
  isActive?:    boolean;
  createdAt?:   ISODateString;
  modifiedAt?:  ISODateString;
}

export interface PerformerRequestDto {
  name:         string;
  bio?:         string;
  genre?:       string;
  nationality?: string;
  websiteUrl?:  string;
  imageUrl?:    string;
  socialLink1?: string;
  socialLink2?: string;
  isActive?:    boolean;
}

export interface EventSessionResponseDto {
  id?:               number;
  eventId?:          number;
  venueId?:          number;
  title:             string;
  description?:      string;
  status?:           string;
  streamUrl?:        string;
  language?:         string;
  totalCapacity?:    number;
  availableCapacity?: number;
  sessionNumber:     number;
  isRecorded?:       boolean;
  startDateTime?:    ISODateString;
  endDateTime?:      ISODateString;
  createdAt?:        ISODateString;
}

// ── Domain Models (what components consume) ───────────────────────────────────

export interface Event {
  id:            string;
  title:         string;
  slug:          string;
  description:   string;
  status:        EventStatus;
  eventType:     EventType;
  venueId:       string;
  bannerUrl:     string;
  posterUrl:     string;
  isFeatured:    boolean;
  isMultiSession: boolean;
  createdAt:     ISODateString;
  updatedAt:     ISODateString;
  performers:    Performer[];
  sessions:      EventSession[];
  ticketTypes:   TicketType[];
}

export interface Performer {
  id:          string;
  name:        string;
  bio:         string;
  genre:       string;
  nationality: string;
  websiteUrl:  string;
  imageUrl:    string;
}

export interface EventSession {
  id:                string;
  eventId:           string;
  title:             string;
  description:       string;
  status:            string;
  sessionNumber:     number;
  totalCapacity:     number;
  availableCapacity: number;
  startDateTime:     ISODateString;
  endDateTime:       ISODateString;
}

export interface TicketType {
  id:                string;
  name:              string;
  description:       string;
  basePrice:         number;
  totalQuantity:     number;
  availableQuantity: number;
  maxPerBooking:     number;
  isActive:          boolean;
  saleStartAt:       ISODateString;
  saleEndAt:         ISODateString;
}

export interface Venue {
  id:            string;
  name:          string;
  description:   string;
  address:       string;
  city:          string;
  state:         string;
  country:       string;
  postalCode:    string;
  totalCapacity: number;
  timezone:      string;
  websiteUrl:    string;
  isActive:      boolean;
  addressLine1?: string;
  latitude?:     number;
  longitude?:    number;
  amenities?:    string[];
}

/**
 * @deprecated Use EventResponseDto instead.
 * Kept for backward compatibility during migration from events/types/index.ts.
 */
export interface EventDTO extends EventResponseDto {}

export type { EventDetail, CastMember, VenueInfo, OfferCoupon, GuidelineItem } from "./event-detail";
