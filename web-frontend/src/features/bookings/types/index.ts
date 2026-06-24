import type { BookingDTO, TicketDTO } from "@/features/venue-seat-map/types";
import type { ISODateString } from "@/shared/types";
import type { BookingStatus } from "@/shared/constants";

// ── API DTOs ──────────────────────────────────────────────────────────────────

export interface BookingResponseDto {
  id:          string;
  eventId:     string;
  userId:      string;
  status:      string;
  qty:         number;
  totalAmount: number;
  seats:       string[];
  createdAt:   ISODateString;
}

export interface CreateBookingRequestDto {
  eventId:     string;
  qty:         number;
  seats:       string[];
  totalAmount: number;
}

export interface SessionSeatRequest {
  sessionSeatId: number;
  eventSessionId: number;
  seatId: number;
  ticketTypeId: number;
}

export interface BookingRequestDTO {
  bookingRef: string;
  userId?: string;
  eventSessionId: number;
  seats: SessionSeatRequest[];
}

export { BookingDTO, TicketDTO };

export interface PageBookingDTO {
  totalPages: number;
  totalElements: number;
  size: number;
  content: BookingDTO[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// ── Domain Model ──────────────────────────────────────────────────────────────

export interface Booking {
  id:          string;
  eventId:     string;
  userId:      string;
  status:      BookingStatus;
  qty:         number;
  totalAmount: number;
  seats:       string[];
  createdAt:   ISODateString;
}

export interface LoyaltyStats {
  points:        number;
  targetPoints:  number;
  attendedCount: number;
}
