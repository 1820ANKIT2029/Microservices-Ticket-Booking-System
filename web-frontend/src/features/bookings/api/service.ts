import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import type { BookingResponseDto, CreateBookingRequestDto, LoyaltyStats } from "../types";

/**
 * BookingService — all HTTP calls for the bookings domain.
 * Pure HTTP adapter: no mapping, no business logic.
 */
export class BookingService {
  static getBookings() {
    return api
      .get<ApiResponse<BookingResponseDto[]>>("/bookings")
      .then((res) => res.data.data);
  }

  static getBookingById(id: string) {
    return api
      .get<ApiResponse<BookingResponseDto>>(`/bookings/${id}`)
      .then((res) => res.data.data);
  }

  static createBooking(data: CreateBookingRequestDto) {
    return api
      .post<ApiResponse<BookingResponseDto>>("/bookings", data)
      .then((res) => res.data.data);
  }

  static deleteBooking(id: string) {
    return api
      .delete<ApiResponse<null>>(`/bookings/${id}`)
      .then((res) => res.data.data);
  }

  static getLoyaltyStats() {
    return api
      .get<ApiResponse<LoyaltyStats>>("/bookings/loyalty-stats")
      .then((res) => res.data.data);
  }
}
