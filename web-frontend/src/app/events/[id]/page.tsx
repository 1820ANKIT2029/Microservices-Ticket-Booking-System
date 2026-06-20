"use client";

import React, { useState } from "react";
import { EventHero } from "@/features/events/components/event-hero";
import { ActionBar } from "@/features/events/components/action-bar";
import { AboutEvent } from "@/features/events/components/about-event";
import { FeaturedLineup } from "@/features/events/components/featured-lineup";
import { OffersGuidelines } from "@/features/events/components/offers-guidelines";
import { VenueDetails } from "@/features/events/components/venue-details";
import { Recommendations } from "@/features/events/components/recommendations";
import { useEvent } from "@/features/events";
import { useSessionsByEvent } from "@/features/event-sessions";
import { useAdminVenue } from "@/features/venue-seat-map";
import { LoadingSpinner } from "@/shared/components";
import { cn } from "@/shared/utils/cn";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

// ── Date Formatting Helpers ──────────────────────────────────────────────────

function formatSessionDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatSessionTime(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = React.use(params);

  // 1. Fetch event detail
  const { data: event, isLoading: eventLoading, isError: eventError } = useEvent(id);

  // 2. Fetch event sessions
  const { data: sessions = [], isLoading: sessionsLoading } = useSessionsByEvent(id);

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
  const locationText = venue ? `${venue.name}, ${venue.city}` : "Wankhede Stadium, Mumbai";

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

  const priceText = event.ticketTypes && event.ticketTypes.length > 0
    ? `₹${Math.min(...event.ticketTypes.map((t) => t.basePrice))}`
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
  } : {
    name: "Wankhede Stadium",
    address: "D Rd, Churchgate, Mumbai, Maharashtra 400020",
    transitInfo: "10 mins walk from Churchgate Station.",
    mapImageUrl: "https://placehold.co/600x400/1e293b/ffffff/png?text=Wankhede+Stadium+Map",
    mapImageAlt: "Wankhede Stadium Map",
    locationName: "Mumbai",
  };

  // Mock offers and guidelines for consumer visual completeness
  const mockOffers = [
    {
      code: "EVENT25",
      discountText: "25% OFF",
      description: "Use code on HDFC Bank Credit Cards. Max discount ₹500.",
    },
    {
      code: "FIRSTBKG",
      discountText: "₹100 OFF",
      description: "Valid on your first booking with EventPass.",
    },
  ];

  const mockGuidelines = [
    {
      iconName: "Info",
      label: "Age Limit: 3+ years and above.",
    },
    {
      iconName: "CameraOff",
      label: "Professional cameras not allowed.",
    },
    {
      iconName: "Clock",
      label: "Gates open 2 hours before session start.",
    },
    {
      iconName: "FileText",
      label: "E-tickets must be scanned for entry.",
    },
  ];

  return (
    <main className="min-h-screen bg-surface flex flex-col">
      {/* 1. Hero Section */}
      <EventHero event={heroEventDetail} />

      {/* 2. Sticky Action Bar */}
      <ActionBar
        priceText={priceText}
        eventId={event.id.toString()}
        selectedSessionId={activeSession?.id}
        selectedSessionText={selectedSessionText}
      />

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
                  const isSoldOut = session.availableCapacity === 0;
                  const isSellingFast = session.availableCapacity > 0 && session.availableCapacity < 20;

                  return (
                    <button
                      key={session.id}
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => setSelectedSessionId(session.id)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        isSoldOut
                          ? "bg-muted border-border opacity-50 cursor-not-allowed"
                          : isSelected
                            ? "bg-primary-container/25 border-primary ring-2 ring-primary/25 scale-[1.02] shadow-sm"
                            : "bg-surface border-border hover:border-primary/50 hover:shadow-sm"
                      )}
                    >
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
                      <div className="text-right flex flex-col items-end gap-1.5">
                        {isSoldOut ? (
                          <span className="bg-destructive/10 text-destructive text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                            Sold Out
                          </span>
                        ) : isSellingFast ? (
                          <span className="bg-amber-500/10 text-amber-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase animate-pulse">
                            Selling Fast
                          </span>
                        ) : (
                          <span className="bg-emerald-500/10 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                            Available
                          </span>
                        )}
                        <span className="text-[10px] font-medium text-on-surface-variant">
                          {session.availableCapacity} seats left
                        </span>
                      </div>
                    </button>
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

          {/* Offers & Guidelines */}
          <OffersGuidelines offers={mockOffers} guidelines={mockGuidelines} />
        </div>

        {/* Right Column: Venue Info */}
        <div className="lg:col-span-4">
          <div className="sticky top-36">
            <VenueDetails venue={mappedVenueInfo} />
          </div>
        </div>
      </div>

      {/* 4. Recommendations Section */}
      <div className="bg-surface-container-lowest py-16">
        <Recommendations />
      </div>
    </main>
  );
}
