import type { BookingResponseDto, Booking } from "./types";
import type { BookingStatus } from "@/shared/constants";

export function toBooking(dto: BookingResponseDto): Booking {
  return {
    id:          dto.id ?? "",
    eventId:     dto.eventId ?? "",
    userId:      dto.userId ?? "",
    status:      (dto.status ?? "PENDING") as BookingStatus,
    qty:         dto.qty ?? 0,
    totalAmount: dto.totalAmount ?? 0,
    seats:       dto.seats ?? [],
    createdAt:   dto.createdAt ?? "",
  };
}

export function toBookingList(dtos: BookingResponseDto[]): Booking[] {
  return dtos.map(toBooking);
}
