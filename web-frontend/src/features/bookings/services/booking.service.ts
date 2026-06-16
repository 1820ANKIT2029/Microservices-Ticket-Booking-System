"use client";

import { api } from "@/shared/api";
import { ApiResponse } from "@/shared/types/api-response";
import { Booking, LoyaltyStats } from "../types/bookings";

export interface CreateBookingPayload {
  eventId: string;
  qty: number;
  seats: string[];
  totalAmount: number;
}

export const BookingService = {
  getBookings: () =>
    api.get<ApiResponse<Booking[]>>("/bookings"),

  getBookingById: (id: string) =>
    api.get<ApiResponse<Booking>>(`/bookings/${id}`),

  createBooking: (data: CreateBookingPayload) =>
    api.post<ApiResponse<Booking>>("/bookings", data),

  getLoyaltyStats: () =>
    api.get<ApiResponse<LoyaltyStats>>("/bookings/loyalty-stats"),
};
