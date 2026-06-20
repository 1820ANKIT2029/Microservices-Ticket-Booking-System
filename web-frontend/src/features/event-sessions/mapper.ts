import type { EventSessionResponseDto, EventSession } from "./types";
import type { SessionStatus } from "@/shared/constants";
import { toTicketType } from "@/features/events/mapper";

export function toEventSession(dto: EventSessionResponseDto): EventSession {
  return {
    id:                String(dto.id ?? ""),
    eventId:           String(dto.eventId ?? ""),
    venueId:           String(dto.venueId ?? ""),
    title:             dto.title ?? "",
    description:       dto.description ?? "",
    status:            (dto.status ?? "SCHEDULED") as SessionStatus,
    sessionNumber:     dto.sessionNumber ?? 1,
    totalCapacity:     dto.totalCapacity ?? 0,
    availableCapacity: dto.availableCapacity ?? 0,
    startDateTime:     dto.startDataTime ?? "",
    endDateTime:       dto.endDataTime ?? "",
    isRecorded:        dto.isRecorded ?? false,
    createdAt:         dto.createdAt ?? "",
    ticketTypes:       (dto.ticketTypes ?? []).map(toTicketType),
  };
}

export function toEventSessionList(dtos: EventSessionResponseDto[]): EventSession[] {
  return dtos.map(toEventSession);
}
