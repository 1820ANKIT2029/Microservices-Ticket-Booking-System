"use client";

import * as React from "react";
import { CheckoutClient } from "@/features/checkout/components/checkout-client";
import { getCheckoutEventById, calculateOrderBreakdown } from "@/features/checkout/constants/checkout-data";

interface PageProps {
  searchParams: Promise<{ eventId?: string; qty?: string; seats?: string; fail?: string }>;
}

export default function CheckoutPage({ searchParams }: PageProps) {
  const resolvedParams = React.use(searchParams);
  const eventId = resolvedParams?.eventId;
  const qty = resolvedParams?.qty;
  const seats = resolvedParams?.seats;
  const fail = resolvedParams?.fail;
  
  // Parse selected seats list
  const seatsList = seats ? seats.split(",") : [];
  
  // Parse ticket quantity (defaults to 2, or length of seatsList if provided)
  const parsedQty = qty ? parseInt(qty, 10) : (seatsList.length > 0 ? seatsList.length : 2);
  const validQty = isNaN(parsedQty) || parsedQty <= 0 ? 2 : parsedQty;

  // Fetch target checkout event details
  const event = getCheckoutEventById(eventId);
  
  // Calculate pricing values
  const breakdown = calculateOrderBreakdown(event, validQty, seatsList);

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
    />
  );
}
