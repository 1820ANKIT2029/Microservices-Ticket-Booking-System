"use client";

import * as React from "react";
import { ConfirmedClient } from "@/features/confirmed/components/confirmed-client";
import { getCheckoutEventById } from "@/features/checkout/constants/checkout-data";

interface PageProps {
  searchParams: Promise<{ eventId?: string; seats?: string; total?: string }>;
}

export default function ConfirmedPage({ searchParams }: PageProps) {
  const resolvedParams = React.use(searchParams);
  const eventId = resolvedParams?.eventId;
  const seats = resolvedParams?.seats;
  const total = resolvedParams?.total;

  const event = getCheckoutEventById(eventId);
  const seatsList = seats ? seats.split(",") : [];
  const totalAmount = total ? parseInt(total, 10) : 0;

  return (
    <ConfirmedClient 
      event={event}
      seatsList={seatsList}
      totalAmount={totalAmount}
    />
  );
}
