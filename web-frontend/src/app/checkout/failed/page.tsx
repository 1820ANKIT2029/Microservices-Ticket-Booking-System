"use client";

import * as React from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FailedClient } from "@/features/checkout";
import { getCheckoutEventById } from "@/features/checkout/constants/checkout-data";
import { BookingService } from "@/features/bookings/api/service";
import type { BookingDTO } from "@/features/venue-seat-map/types";

function FailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId") || undefined;
  const seats = searchParams.get("seats") || undefined;
  const total = searchParams.get("total") || undefined;
  const reason = searchParams.get("reason") || undefined;
  const bookingId = searchParams.get("bookingId") || undefined;

  const [booking, setBooking] = useState<BookingDTO | null>(null);
  const [loading, setLoading] = useState(!!bookingId);

  useEffect(() => {
    if (!bookingId) return;
    BookingService.getEventBooking(bookingId)
      .then((data) => {
        setBooking(data);
        if (data && (data.status === "CONFIRMED" || data.status === "COMPLETED")) {
          router.push(`/checkout/confirmed?eventId=${eventId || ""}&seats=${seats || ""}&total=${data.totalAmount}&bookingId=${bookingId}`);
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
          <p className="text-sm text-muted-foreground font-medium">Verifying booking failure details...</p>
        </div>
      </div>
    );
  }

  return (
    <FailedClient 
      event={event}
      seatsList={seatsList}
      totalAmount={totalAmount}
      reason={reason}
      bookingRef={bookingRef}
    />
  );
}

export default function FailedPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <FailedContent />
    </Suspense>
  );
}
