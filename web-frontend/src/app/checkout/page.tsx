"use client";

import * as React from "react";
import { CheckoutClient } from "@/features/checkout/components/checkout-client";
import { getCheckoutEventById, calculateOrderBreakdown } from "@/features/checkout/constants/checkout-data";

interface PageProps {
  searchParams: Promise<{
    eventId?: string;
    qty?: string;
    seats?: string;
    fail?: string;
    sessionId?: string;
    seatIds?: string;
    sessionSeatIds?: string;
    bookingRef?: string;
    total?: string;
    subtotal?: string;
    tax?: string;
    gatewayKey?: string;
    bookingId?: string;
  }>;
}

export default function CheckoutPage({ searchParams }: PageProps) {
  const resolvedParams = React.use(searchParams);
  const eventId = resolvedParams?.eventId;
  const qty = resolvedParams?.qty;
  const seats = resolvedParams?.seats;
  const fail = resolvedParams?.fail;
  const sessionId = resolvedParams?.sessionId;
  const seatIds = resolvedParams?.seatIds;
  const sessionSeatIds = resolvedParams?.sessionSeatIds;
  const bookingRef = resolvedParams?.bookingRef;
  const total = resolvedParams?.total;
  const subtotal = resolvedParams?.subtotal;
  const tax = resolvedParams?.tax;
  const gatewayKey = resolvedParams?.gatewayKey;
  const bookingId = resolvedParams?.bookingId;

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
