import { useQuery } from "@tanstack/react-query";
import { BookingService } from "../../services/booking.service";
import { queryKeys } from "@/shared/hooks/keys";
import { useAuthStore } from "@/shared/store";
import { Booking } from "../../types/bookings";

export function useBookings() {
  const accessToken = useAuthStore((s) => s.accessToken);
  // Fallback to localStorage for legacy paths that set token without going through the store
  const hasToken = !!accessToken || (typeof window !== "undefined" && !!localStorage.getItem("token"));

  return useQuery<Booking[]>({
    queryKey: queryKeys.bookings.list(),
    queryFn: () => BookingService.getBookings().then((res) => res.data.data),
    enabled: hasToken,
  });
}
