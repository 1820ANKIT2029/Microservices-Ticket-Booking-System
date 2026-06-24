"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckoutClient } from "@/features/checkout/components/checkout-client";
import { getCheckoutEventById, calculateOrderBreakdown } from "@/features/checkout/constants/checkout-data";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId") || undefined;
  const qty = searchParams.get("qty") || undefined;
  const seats = searchParams.get("seats") || undefined;
  const fail = searchParams.get("fail") || undefined;
  const sessionId = searchParams.get("sessionId") || undefined;
  const seatIds = searchParams.get("seatIds") || undefined;
  const sessionSeatIds = searchParams.get("sessionSeatIds") || undefined;
  const bookingRef = searchParams.get("bookingRef") || undefined;
  const total = searchParams.get("total") || undefined;
  const subtotal = searchParams.get("subtotal") || undefined;
  const tax = searchParams.get("tax") || undefined;
  const gatewayKey = searchParams.get("gatewayKey") || undefined;
  const bookingId = searchParams.get("bookingId") || undefined;

  // Parse selected seat IDs
  const seatIdsList = seatIds ? seatIds.split(",").map((id) => Number(id)) : [];
  
  // Parse session seat IDs
  const sessionSeatIdsList = sessionSeatIds ? sessionSeatIds.split(",").map((id) => Number(id)) : [];
  
  // Parse selected seats list
  const seatsList = seats ? seats.split(",") : [];
  
  // Parse ticket quantity (defaults to 2, or length of seatsList if provided)
  const parsedQty = qty ? parseInt(qty, 10) : (seatsList.length > 0 ? seatsList.length : 2);
  const validQty = isNaN(parsedQty) || parsedQty <= 0 ? 2 : parsedQty;

  // Fetch target checkout event details
  const event = getCheckoutEventById(eventId);
  
  // Calculate pricing values — override with backend direct booking numbers if available
  const breakdown = bookingRef ? {
    basePrice: Number(subtotal) / (validQty || 1),
    qty: validQty,
    baseFareTotal: Number(subtotal),
    bookingFee: Number(total) - Number(subtotal) - Number(tax),
    taxesGst: Number(tax),
    totalAmount: Number(total),
  } : calculateOrderBreakdown(event, validQty, seatsList);

  // Dynamic ticket type label containing selected seats
  const dynamicEvent = { ...event };
  if (seatsList.length > 0) {
    const formattedSeats = seatsList.map(s => {
      const parts = s.split("-");
      return parts[0] + parts[2];
    }).join(", ");
    dynamicEvent.ticketType = `${event.ticketType} (${formattedSeats})`;
  }

  return (
    <CheckoutClient 
      event={dynamicEvent} 
      breakdown={breakdown} 
      seats={seats} 
      fail={fail === "true"} 
      bookingRef={bookingRef}
      gatewayKey={gatewayKey}
      bookingId={bookingId}
    />
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
