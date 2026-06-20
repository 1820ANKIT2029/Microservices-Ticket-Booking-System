"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { SeatMapViewerPage } from "@/features/venue-seat-map";
import { useEvent } from "@/features/events/hooks/useEvent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SeatsPage({ params }: PageProps) {
  const { id } = React.use(params);

  if (!id) {
    return notFound();
  }

  // Load the event to get the real venueId from the backend
  const { data: event, isLoading } = useEvent(id);

  // Determine venueId, falling back to 1 if not loaded/offline
  let venueId = 1;
  if (event?.venueId) {
    const parsedVenueId = parseInt(event.venueId, 10);
    if (!isNaN(parsedVenueId)) {
      venueId = parsedVenueId;
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Loading event details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] mt-16">
      <SeatMapViewerPage venueId={venueId} eventId={id} />
    </div>
  );
}
