"use client";

import React, { Suspense } from "react";
import { SeatMapViewerPage } from "@/features/venue-seat-map";
import { eventQueries } from "@/features/events/hooks/EventQueryService";
import { useSessionsByEvent } from "@/features/event-sessions";
import { useSearchParams, useRouter } from "next/navigation";

function SeatsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const sessionId = searchParams.get("sessionId") || undefined;
  const router = useRouter();

  const { data: event, isLoading: eventLoading } = eventQueries.useEvent(id || "");
  const { data: sessions = [], isLoading: sessionsLoading } = useSessionsByEvent(id || "");

  if (!id) {
    // Replace notFound() with a client-side return/redirect
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-bold">Event Not Found</p>
          <button onClick={() => router.push("/")} className="text-primary hover:underline">Return Home</button>
        </div>
      </div>
    );
  }


  const isLoading = eventLoading || sessionsLoading;

  // Determine venueId, falling back to 1 if not loaded/offline
  let venueId = 1;
  const session = sessionId ? sessions.find((s) => s.id === sessionId) : null;
  const targetVenueId = session?.venueId || event?.venueId;

  if (targetVenueId) {
    const parsedVenueId = parseInt(targetVenueId as string, 10);
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
      <SeatMapViewerPage venueId={venueId} eventId={id} sessionId={sessionId} />
    </div>
  );
}

export default function SeatsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <SeatsContent />
    </Suspense>
  );
}
