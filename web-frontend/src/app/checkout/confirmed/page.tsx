"use client";

import * as React from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ConfirmedClient } from "@/features/checkout";
import { BookingService } from "@/features/bookings/api/service";
import { EventService } from "@/features/events/api/service";
import { toEvent, toVenue } from "@/features/events/mapper";
import { VenueSeatMapService } from "@/features/venue-seat-map/api/service";
import { JwtUtils } from "@/shared/utils";
import { TOKEN_KEY } from "@/shared/constants";
import type { BookingDTO, SessionSeatDTO } from "@/features/venue-seat-map/types";
import type { Event, Venue } from "@/features/events/types";

function ConfirmedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const bookingId = searchParams.get("bookingId");
  const seats = searchParams.get("seats");
  const total = searchParams.get("total");

  const [booking, setBooking] = useState<BookingDTO | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [canvasVenue, setCanvasVenue] = useState<any | null>(null);
  const [sessionSeats, setSessionSeats] = useState<SessionSeatDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Treat null/undefined strings as empty
      const resolvedBookingId = (bookingId && bookingId !== "null" && bookingId !== "undefined") ? bookingId : null;

      try {
        setLoading(true);
        let finalBookingData: BookingDTO | null = null;
        let finalBookingId = resolvedBookingId;

        // Fallback 1: If bookingId is missing/null, try to load latest booking of user
        if (!finalBookingId) {
          const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem(TOKEN_KEY)) : null;
          const userId = token ? (JwtUtils.getUserIdFromToken(token) || null) : null;
          
          if (userId) {
            try {
              const userBookings = await BookingService.getBookings(0, 5);
              const latest = userBookings.content.find(
                (b) => b.status === "confirmed" || b.status === "CONFIRMED" || b.status === "COMPLETED"
              );
              if (latest) {
                finalBookingId = latest.id;
              }
            } catch (err) {
              console.error("Failed to load user latest bookings for fallback:", err);
            }
          }
        }

        // If we resolved a booking ID (directly or via user fallback)
        if (finalBookingId) {
          try {
            const bookingData = await BookingService.getBooking(finalBookingId);
            if (bookingData) {
              finalBookingData = bookingData;

              if (bookingData.status === "CANCELLED") {
                router.push(`/checkout/failed?eventId=${eventId || ""}&bookingId=${finalBookingId}&reason=declined`);
                return;
              }

              // Fetch tickets fallback if empty
              let tickets = bookingData.tickets;
              if (!tickets || tickets.length === 0) {
                const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem(TOKEN_KEY)) : null;
                const userId = token ? (JwtUtils.getUserIdFromToken(token) || "1") : "1";
                try {
                  tickets = await BookingService.getTicketsOfBooking(finalBookingId, userId);
                  bookingData.tickets = tickets;
                } catch (err) {
                  console.error("Failed to load tickets details from API:", err);
                }
              }

              setBooking(bookingData);
            }
          } catch (err) {
            console.error(`Failed to load booking details for ID ${finalBookingId}:`, err);
          }
        }

        // 2. Fetch Event details
        if (finalBookingData) {
          const resolvedEventId = eventId || String(finalBookingData.eventSessionId);
          let eventData: Event | null = null;
          try {
            const eventDto = await EventService.getEventById(resolvedEventId);
            eventData = toEvent(eventDto);
            setEvent(eventData);
          } catch (err) {
            console.error("Failed to load event details from API:", err);
          }

          // 3. Fetch Venue details & session seats
          const resolvedVenueId = eventData?.venueId;
          if (resolvedVenueId) {
            try {
              const [venueDto, canvasVenueData, sessionSeatsData] = await Promise.all([
                EventService.getVenueById(resolvedVenueId),
                VenueSeatMapService.getVenue(resolvedVenueId).catch(() => null),
                VenueSeatMapService.getSessionSeats(finalBookingData.eventSessionId).catch(() => []),
              ]);
              setVenue(toVenue(venueDto));
              setCanvasVenue(canvasVenueData);
              setSessionSeats(sessionSeatsData);
            } catch (err) {
              console.error("Failed to load venue or session seats details from API:", err);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching checkout confirmed data details:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [bookingId, eventId, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground font-semibold">Verifying your booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking || !event || !venue) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background gap-4">
        <h2 className="text-2xl font-bold">Booking Not Found</h2>
        <p className="text-muted-foreground">We could not retrieve your booking details.</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <ConfirmedClient 
      booking={booking}
      event={event}
      venue={venue}
      canvasVenue={canvasVenue}
      sessionSeats={sessionSeats}
    />
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <ConfirmedContent />
    </Suspense>
  );
}


