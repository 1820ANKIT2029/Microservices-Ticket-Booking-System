"use client";

import { useQuery } from "@tanstack/react-query";
import { BookingService } from "../api/service";
import { bookingKeys } from "../query-keys";
import type { LoyaltyStats } from "../types";
import { useAuthStore } from "@/shared/store";

export function useLoyaltyStats() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasToken = !!accessToken || (typeof window !== "undefined" && !!localStorage.getItem("token"));

  return useQuery<LoyaltyStats>({
    queryKey: bookingKeys.loyalty(),
    queryFn:  () => BookingService.getLoyaltyStats(),
    enabled:  hasToken,
  });
}
