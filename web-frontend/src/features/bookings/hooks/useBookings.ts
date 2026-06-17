"use client";

import { useQuery } from "@tanstack/react-query";
import { BookingService } from "../api/service";
import { bookingKeys } from "../query-keys";
import { toBookingList } from "../mapper";
import { useAuthStore } from "@/shared/store";
import type { Booking } from "../types";

export function useBookings() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasToken = !!accessToken || (typeof window !== "undefined" && !!localStorage.getItem("token"));

  return useQuery<Booking[]>({
    queryKey: bookingKeys.list(),
    queryFn:  async () => {
      const dtos = await BookingService.getBookings();
      return toBookingList(dtos);
    },
    enabled: hasToken,
  });
}
