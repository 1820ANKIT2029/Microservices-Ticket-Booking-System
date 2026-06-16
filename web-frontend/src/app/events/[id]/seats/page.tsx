"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { SeatsClient } from "@/features/seats/components/seats-client";
import { getCheckoutEventById } from "@/features/checkout/constants/checkout-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SeatsPage({ params }: PageProps) {
  const { id } = React.use(params);
  
  if (!id) {
    return notFound();
  }

  const event = getCheckoutEventById(id);

  return <SeatsClient event={event} eventId={id} />;
}
