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
