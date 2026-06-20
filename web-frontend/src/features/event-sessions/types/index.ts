import type { ISODateString } from "@/shared/types";
import type { SessionStatus } from "@/shared/constants";
import type { TicketTypeResponseDto, TicketType } from "@/features/events/types";

// ── API DTOs ──────────────────────────────────────────────────────────────────

export interface EventSessionResponseDto {
  id?:                number;
  eventId?:           number;
  venueId?:           number;
  title:              string;
  description?:       string;
  status?:            string;
  streamUrl?:         string;
  language?:          string;
  totalCapacity?:     number;
  availableCapacity?: number;
  sessionNumber:      number;
  isRecorded?:        boolean;
  startDataTime?:     ISODateString;
  endDataTime?:       ISODateString;
  createdAt?:         ISODateString;
  ticketTypes?:      TicketTypeResponseDto[];
}

export interface EventSessionRequestDto {
  eventId:            number;
  venueId?:           number;
  title:              string;
  description?:       string;
  streamUrl?:         string;
  language?:          string;
  totalCapacity?:     number;
  sessionNumber:      number;
  isRecorded?:        boolean;
  startDataTime?:     ISODateString;
  endDataTime?:       ISODateString;
}

// ── Domain Model ──────────────────────────────────────────────────────────────

export interface EventSession {
  id:                string;
  eventId:           string;
  venueId:           string;
  title:             string;
  description:       string;
  status:            SessionStatus;
  sessionNumber:     number;
  totalCapacity:     number;
  availableCapacity: number;
  startDateTime:     ISODateString;
  endDateTime:       ISODateString;
  isRecorded:        boolean;
  createdAt:         ISODateString;
  ticketTypes?:      TicketType[];
}

/**
 * @deprecated Use EventSessionResponseDto instead.
 * Kept for backward compatibility.
 */
export interface EventSessionDTO extends EventSessionResponseDto {}
