import React from "react";
import { EventHero } from "@/features/event-detail/components/event-hero";
import { ActionBar } from "@/features/event-detail/components/action-bar";
import { AboutEvent } from "@/features/event-detail/components/about-event";
import { FeaturedLineup } from "@/features/event-detail/components/featured-lineup";
import { OffersGuidelines } from "@/features/event-detail/components/offers-guidelines";
import { VenueDetails } from "@/features/event-detail/components/venue-details";
import { Recommendations } from "@/features/event-detail/components/recommendations";
import { DEFAULT_EVENT_DETAIL } from "@/features/event-detail/constants/event-data";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  
  // For now, we use the static mock data. In a real app, we would fetch
  // event details using the `id`.
  const event = { ...DEFAULT_EVENT_DETAIL, id };

  return (
    <main className="min-h-screen bg-surface flex flex-col">
      {/* 1. Hero Section */}
      <EventHero event={event} />

      {/* 2. Sticky Action Bar */}
      <ActionBar priceText={event.priceText} eventId={event.id} />

      {/* 3. Main Content Area */}
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-16 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Left Column: Details */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          <AboutEvent paragraphs={event.descriptionParagraphs} />
          {event.lineup && event.lineup.length > 0 && (
            <FeaturedLineup lineup={event.lineup} />
          )}
          <OffersGuidelines offers={event.offers} guidelines={event.guidelines} />
        </div>

        {/* Right Column: Venue Info */}
        <div className="lg:col-span-4">
          <div className="sticky top-36">
            <VenueDetails venue={event.venue} />
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
