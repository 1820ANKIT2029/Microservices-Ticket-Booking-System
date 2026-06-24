"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookingService } from "../api/service";
import { bookingKeys } from "../query-keys";
import { toBooking } from "../mapper";
import type { CreateBookingRequestDto, Booking } from "../types";

/**
 * Creates a new booking.
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingRequestDto) =>
      BookingService.createBooking(data).then(toBooking),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
    },
  });
}

/**
 * Deletes a booking with optimistic update.
 * Now correctly goes through BookingService instead of calling api.delete() directly.
 */
export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => BookingService.deleteBooking(bookingId),

    onMutate: async (bookingId) => {
      await queryClient.cancelQueries({ queryKey: bookingKeys.list() });

      const previousBookings = queryClient.getQueryData<Booking[]>(bookingKeys.list());

      if (previousBookings) {
        queryClient.setQueryData<Booking[]>(
          bookingKeys.list(),
          previousBookings.filter((b) => b.id !== bookingId)
        );
      }

      return { previousBookings };
    },

    onError: (_err, _bookingId, context) => {
      if (context?.previousBookings) {
        queryClient.setQueryData(bookingKeys.list(), context.previousBookings);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
    },
  });
}
