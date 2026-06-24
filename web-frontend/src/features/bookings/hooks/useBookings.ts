"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import { BookingService } from "../api/service";
import { EventSessionService } from "@/features/event-sessions/api/service";
import { EventService } from "@/features/events/api/service";
import { bookingKeys } from "../query-keys";
import { useAuthStore } from "@/shared/store";
import type { Booking } from "../types/bookings";
import type { BookingResponseDto } from "../types";
import type { PageEventSearchResponse } from "@/features/search/types";

function formatEventDate(dateString?: string) {
  if (!dateString) return "TBD";
  try {
    const d = new Date(dateString);
    return d.toLocaleString("en-US", {
      weekday: "long",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).replace(",", " •");
  } catch (e) {
    return "TBD";
  }
}

export function useBookings(page = 0, size = 10) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasToken = !!accessToken || (typeof window !== "undefined" && !!localStorage.getItem("token"));

  return useQuery({
    queryKey: [...bookingKeys.all, "list", page, size],
    queryFn: async () => {
      const pageResult = await BookingService.getBookings(page, size);
      
      // Concurrently fetch all metadata required for lookups
      const [sessions, venues, eventsResponse] = await Promise.all([
        EventSessionService.getSessions(undefined, 0, 100),
        EventService.getVenues(),
        api.get<ApiResponse<PageEventSearchResponse>>("/event/api/events/search", {
          params: { page: 0, size: 100 }
        }).then(res => res.data.data.content || [])
      ]);

      const sessionMap = new Map(sessions.map(s => [s.id, s]));
      const venueMap = new Map(venues.map(v => [v.id, v]));
      const eventMap = new Map(eventsResponse.map(e => [e.id, e]));

      const mappedContent: Booking[] = pageResult.content.map((b: BookingResponseDto) => {
        const session = sessionMap.get(Number(b.eventId));
        const parentEventId = session?.eventId;
        const event = parentEventId ? eventMap.get(Number(parentEventId)) : null;
        const venue = session?.venueId ? venueMap.get(Number(session.venueId)) : null;

        const eventType = event?.eventType || "";
        const category = eventType.charAt(0).toUpperCase() + eventType.slice(1).toLowerCase() || "Entertainment";

        // Classify dynamic status (completed if event is in the past)
        const sessionDate = session?.startDataTime ? new Date(session.startDataTime) : null;
        const isPast = sessionDate ? sessionDate < new Date() : false;

        let status: "confirmed" | "completed" | "cancelled" = "confirmed";
        if (b.status === "CANCELLED" || b.status === "EXPIRED") {
          status = "cancelled";
        } else if (isPast) {
          status = "completed";
        } else {
          status = "confirmed";
        }

        return {
          id: b.id,
          title: event?.title || session?.title || "Booking Session " + b.eventId,
          category,
          status,
          dateText: session?.startDataTime ? formatEventDate(session.startDataTime) : "TBD",
          location: venue ? `${venue.name}, ${venue.city || ""}` : "Venue TBD",
          imageUrl: event?.bannerUrl || "https://placehold.co/600x400/1d1a25/ffffff/png?text=EventPass",
          imageAlt: event?.title || "Event Image",
          description: (event as any)?.description || session?.description || "",
          pricePaid: b.totalAmount ? `$${b.totalAmount.toFixed(2)}` : "$0.00",
        };
      });

      return {
        content: mappedContent,
        totalPages: pageResult.totalPages,
        totalElements: pageResult.totalElements,
        size: pageResult.size,
        number: pageResult.number,
        first: pageResult.first,
        last: pageResult.last,
      };
    },
    enabled: hasToken,
  });
}
