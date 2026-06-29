"use client";

import React, { useState } from "react";
import { EventHero } from "@/features/events/components/event-hero";
import { AboutEvent } from "@/features/events/components/about-event";
import { FeaturedLineup } from "@/features/events/components/featured-lineup";
import { VenueDetails } from "@/features/events/components/venue-details";
import { eventQueries } from "@/features/events/hooks/EventQueryService";
import { useSessionsByEvent } from "@/features/event-sessions";
import { useAdminVenue } from "@/features/venue-seat-map";
import { LoadingSpinner } from "@/shared/components";
import { cn } from "@/shared/utils/cn";
import { FormatUtils } from "@/shared/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

// ── Date Formatting Helpers ──────────────────────────────────────────────────

function formatSessionDate(dateStr: string) {
  try {
    return FormatUtils.formatDate(dateStr);
  } catch {
    return dateStr;
  }
}

function formatSessionTime(dateStr: string) {
  try {
    return FormatUtils.formatTime(dateStr);
  } catch {
    return "";
  }
}

function EventDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // 1. Fetch event detail
  const { data: event, isLoading: eventLoading, isError: eventError } = eventQueries.useEvent(id || "");

  // 2. Fetch event sessions
  const { data: sessions = [], isLoading: sessionsLoading } = useSessionsByEvent(id || "");

  // 3. Fetch venue details (enabled only when event venueId is resolved)
  const venueId = event?.venueId;
  const { data: venue, isLoading: venueLoading } = useAdminVenue(venueId ?? 0);

  // 4. Session selection state
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Loading indicator
  if (eventLoading || sessionsLoading || venueLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <LoadingSpinner message="Loading event details..." />
      </div>
    );
  }

  // Error state
  if (eventError || !event || !id) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <p className="text-5xl">🎟️</p>
          <h2 className="text-lg font-bold text-foreground">Event not found</h2>
          <p className="text-sm text-muted-foreground">The event you are looking for does not exist or is offline.</p>
        </div>
      </div>
    );
  }

  // ── Mappings from API to presentational components ──────────────────────────

  const activeSession = (sessions && selectedSessionId)
    ? (sessions.find((s) => s.id === selectedSessionId) || sessions[0])
    : (sessions?.[0] || null);

  const dateText = activeSession ? formatSessionDate(activeSession.startDateTime) : "Multiple Dates";
  const timeText = activeSession ? formatSessionTime(activeSession.startDateTime) : "Evening Show";
  const locationText = venue ? `${venue.name}, ${venue.city}` : "";

  const heroEventDetail = {
    title: event.title,
    category: event.eventType || "EVENT",
    dateText,
    timeText,
    locationText,
    imageUrl: event.bannerUrl || event.posterUrl || `https://placehold.co/1920x1080/5400c3/ffffff/png?text=${encodeURIComponent(event.title)}`,
    imageAlt: event.title,
    descriptionParagraphs: event.description ? event.description.split("\n") : [],
  };

  const allTicketTypes = sessions.flatMap((s) => s.ticketTypes || []);
  const priceText = allTicketTypes.length > 0
    ? `₹${Math.min(...allTicketTypes.map((t) => t.basePrice))}`
    : "₹1,200";

  const selectedSessionText = activeSession
    ? `${formatSessionDate(activeSession.startDateTime)} · ${formatSessionTime(activeSession.startDateTime)}`
    : undefined;

  const lineup = event.performers?.map((p) => ({
    name: p.name,
    role: p.genre || "Featured Artist",
    imageUrl: p.imageUrl || `https://placehold.co/300x300/5400c3/ffffff/png?text=${encodeURIComponent(p.name)}`,
    imageAlt: `Portrait photo of ${p.name}`,
  })) || [];

  const mappedVenueInfo = venue ? {
    name: venue.name,
    address: venue.address || `${venue.addressLine1 || ""}, ${venue.city || ""}, ${venue.state || ""}`,
    transitInfo: Array.isArray(venue.amenities)
      ? venue.amenities.join(", ")
      : (venue.amenities || "Easy access via public transit and highways."),
    mapImageUrl: "https://placehold.co/600x400/1e293b/ffffff/png?text=" + encodeURIComponent(venue.name + " Map"),
    mapImageAlt: `Satellite map of ${venue.name}`,
    locationName: venue.city || "",
  } : null;

  return (
    <main className="min-h-screen bg-surface flex flex-col">
      {/* 1. Hero Section */}
      <EventHero event={heroEventDetail} />



      {/* 3. Main Content Area */}
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-16 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Left Column: Details */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          {/* About Event */}
          <AboutEvent paragraphs={heroEventDetail.descriptionParagraphs} />

          {/* Session Selection */}
          <section aria-labelledby="sessions-title" className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 shadow-sm text-left">
            <h2 id="sessions-title" className="text-headline-md font-bold mb-2 border-l-4 border-primary pl-3">
              Select Session / Show Date
            </h2>
            <p className="text-sm text-muted-foreground mb-6 pl-4">
              Choose your preferred date and time to view the seat map and book tickets.
            </p>

            {sessions && sessions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sessions.map((session) => {
                  const isSelected = activeSession?.id === session.id;

                  return (
                    <div
                      key={session.id}
                      onClick={() => setSelectedSessionId(session.id)}
                      className={cn(
                        "flex flex-col p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer",
                        isSelected
                          ? "bg-primary-container/25 border-primary ring-2 ring-primary/25 scale-[1.02] shadow-sm"
                          : "bg-surface border-border hover:border-primary/50 hover:shadow-sm"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="space-y-1">
                          <p className="font-bold text-on-surface text-label-md">
                            {formatSessionDate(session.startDateTime)}
                          </p>
                          <p className="text-xs text-on-surface-variant font-medium">
                            {formatSessionTime(session.startDateTime)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {session.title || `Session ${session.sessionNumber}`}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-4 pt-3 border-t border-primary/20">
                          <Link
                            href={`/events/seats?id=${event.id}&sessionId=${session.id}`}
                            className="w-full bg-primary text-on-primary py-2 px-4 rounded-lg font-bold text-sm hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md text-center block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Book Tickets
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 border border-dashed border-border rounded-xl text-center">
                <p className="text-sm text-muted-foreground">No sessions scheduled for this event.</p>
              </div>
            )}
          </section>

          {/* Lineup */}
          {lineup.length > 0 && (
            <FeaturedLineup lineup={lineup} />
          )}

        </div>

        {/* Right Column: Venue Info */}
        <div className="lg:col-span-4">
          <div className="sticky top-36">
            {mappedVenueInfo && <VenueDetails venue={mappedVenueInfo} />}
          </div>
        </div>
      </div>


    </main>
  );
}

export default function EventDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <LoadingSpinner message="Loading event details..." />
      </div>
    }>
      <EventDetailContent />
    </Suspense>
  );
}
