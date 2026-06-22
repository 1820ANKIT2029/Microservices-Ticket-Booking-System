"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ConfirmedClient } from "@/features/checkout";
import { getCheckoutEventById } from "@/features/checkout/constants/checkout-data";
import { BookingService } from "@/features/bookings/api/service";
import type { BookingDTO } from "@/features/venue-seat-map/types";

interface PageProps {
  searchParams: Promise<{ eventId?: string; seats?: string; total?: string; bookingId?: string }>;
}

export default function ConfirmedPage({ searchParams }: PageProps) {
  const router = useRouter();
  const resolvedParams = React.use(searchParams);
  const eventId = resolvedParams?.eventId;
  const seats = resolvedParams?.seats;
  const total = resolvedParams?.total;
  const bookingId = resolvedParams?.bookingId;

  const [booking, setBooking] = useState<BookingDTO | null>(null);
  const [loading, setLoading] = useState(!!bookingId);

  useEffect(() => {
    if (!bookingId) return;
    BookingService.getEventBooking(bookingId)
      .then((data) => {
        setBooking(data);
        if (data && data.status === "CANCELLED") {
          router.push(`/checkout/failed?eventId=${eventId || ""}&seats=${seats || ""}&total=${data.totalAmount}&bookingId=${bookingId}&reason=declined`);
        }
      })
      .catch((err) => console.error("Failed to load booking details from API:", err))
      .finally(() => setLoading(false));
  }, [bookingId, eventId, seats, router]);

  const event = getCheckoutEventById(eventId);
  const seatsList = seats ? seats.split(",") : [];
  
  // Use backend booking values if loaded, otherwise fall back to query params
  const totalAmount = booking ? Number(booking.totalAmount) : (total ? parseInt(total, 10) : 0);
  const bookingRef = booking ? booking.bookingRef : undefined;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Verifying your booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <ConfirmedClient 
      event={event}
      seatsList={seatsList}
      totalAmount={totalAmount}
      bookingRef={bookingRef}
    />
  );
}
