"use client";

import { useMutation } from "@tanstack/react-query";
import { CheckoutService } from "../api/service";
import type { CreateBookingRequestDto } from "@/features/bookings/types";

export function useValidateSession() {
  return useMutation({
    mutationFn: ({ eventId, seats }: { eventId: string; seats: string[] }) =>
      CheckoutService.validateSession(eventId, seats),
  });
}

export function useProcessPayment() {
  return useMutation({
    mutationFn: ({
      bookingData,
      paymentToken,
    }: {
      bookingData: CreateBookingRequestDto;
      paymentToken: string;
    }) => CheckoutService.processPayment(bookingData, paymentToken),
  });
}
