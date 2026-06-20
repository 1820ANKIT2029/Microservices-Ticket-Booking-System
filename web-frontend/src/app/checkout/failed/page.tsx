"use client";

import * as React from "react";
import { FailedClient } from "@/features/checkout";
import { getCheckoutEventById } from "@/features/checkout/constants/checkout-data";

interface PageProps {
  searchParams: Promise<{ eventId?: string; seats?: string; total?: string; reason?: string }>;
}

export default function FailedPage({ searchParams }: PageProps) {
  const resolvedParams = React.use(searchParams);
  const eventId = resolvedParams?.eventId;
  const seats = resolvedParams?.seats;
  const total = resolvedParams?.total;
  const reason = resolvedParams?.reason;

  const event = getCheckoutEventById(eventId);
  const seatsList = seats ? seats.split(",") : [];
  const totalAmount = total ? parseInt(total, 10) : 0;

  return (
    <FailedClient 
      event={event}
      seatsList={seatsList}
      totalAmount={totalAmount}
      reason={reason}
    />
  );
}
