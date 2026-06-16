import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { ApiResponse } from "@/shared/types/api-response";
import { queryKeys } from "@/shared/hooks/keys";
import { Booking } from "../../types/bookings";

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) =>
      api.delete<ApiResponse<null>>(`/bookings/${bookingId}`).then((res) => res.data.data),

    onMutate: async (bookingId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.bookings.list() });

      const previousBookings = queryClient.getQueryData<Booking[]>(queryKeys.bookings.list());

      if (previousBookings) {
        queryClient.setQueryData<Booking[]>(
          queryKeys.bookings.list(),
          previousBookings.filter((booking) => booking.id !== bookingId)
        );
      }

      return { previousBookings };
    },

    onError: (_err, _bookingId, context) => {
      if (context?.previousBookings) {
        queryClient.setQueryData(queryKeys.bookings.list(), context.previousBookings);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.list() });
    },
  });
}
