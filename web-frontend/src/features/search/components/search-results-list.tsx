"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Heart } from "lucide-react";
import { SearchResultEvent } from "../types/search";

interface SearchResultsListProps {
  events: SearchResultEvent[];
}

export function SearchResultsList({ events }: SearchResultsListProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-outline-variant/30 rounded-xl bg-surface-container-low/30">
        <p className="text-on-surface-variant font-semibold text-lg mb-2">No events found</p>
        <p className="text-sm text-on-surface-variant/70 max-w-md">
          We couldn&apos;t find any events matching your selected filters. Try broadening your query or clearing some criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

function EventCard({ event }: { event: SearchResultEvent }) {
  const [isFavorited, setIsFavorited] = useState(false);

  // Map to checkout page or generic details page
  const detailsUrl = `/events/${event.id}`;

  return (
    <article className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Card Header Image Block */}
      <div className="relative h-48 w-full overflow-hidden group">
        <Image
          src={event.imageUrl}
          alt={event.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 30vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          unoptimized
        />
        {/* Favorite micro-interaction button */}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          type="button"
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all text-on-surface-variant hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={isFavorited ? `Remove ${event.title} from favorites` : `Add ${event.title} to favorites`}
        >
          <Heart
            className={`size-5 transition-colors ${
              isFavorited ? "fill-primary text-primary" : ""
            }`}
          />
        </button>
        <div className="absolute bottom-3 left-3 bg-primary text-on-primary px-3.5 py-1 rounded-full font-semibold text-xs shadow-md">
          {event.category}
        </div>
      </div>

      {/* Card Body content */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-5">
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <h4 className="font-bold text-base md:text-lg leading-tight text-on-surface line-clamp-2">
              {event.title}
            </h4>
            <span className="font-bold text-base md:text-lg text-primary shrink-0">
              {event.priceText}
            </span>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 text-on-surface-variant">
              <Calendar className="size-4.5 text-primary shrink-0" aria-hidden="true" />
              <span className="text-xs md:text-sm font-medium">{event.dateText}</span>
            </div>
            <div className="flex items-center gap-2.5 text-on-surface-variant">
              <MapPin className="size-4.5 text-primary shrink-0" aria-hidden="true" />
              <span className="text-xs md:text-sm font-medium truncate">{event.location}</span>
            </div>
          </div>
        </div>

        <Link
          href={detailsUrl}
          className="w-full text-center py-2.5 border border-primary hover:bg-primary/5 text-primary font-semibold text-xs md:text-sm rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        >
          View Tickets
        </Link>
      </div>
    </article>
  );
}
