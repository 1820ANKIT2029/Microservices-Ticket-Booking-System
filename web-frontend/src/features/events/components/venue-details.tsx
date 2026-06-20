import Image from "next/image";
import { MapPin, Bus } from "lucide-react";
import type { VenueInfo } from "../types/event-detail";

interface VenueDetailsProps {
  venue: VenueInfo;
}

export function VenueDetails({ venue }: VenueDetailsProps) {
  return (
    <section aria-labelledby="venue-title">
      <h2 id="venue-title" className="text-headline-md font-bold mb-6 border-l-4 border-primary pl-3">
        Venue Details
      </h2>
      <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant flex flex-col md:flex-row gap-6">
        {/* Map Preview Column */}
        <div className="md:w-1/2 h-48 rounded-lg overflow-hidden relative group shadow-sm border border-outline-variant/30">
          <Image
            src={venue.mapImageUrl}
            alt={venue.mapImageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(venue.name + ", " + venue.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-surface text-primary hover:text-primary-container px-4 py-2 rounded-full shadow-lg border border-primary/20 flex items-center gap-2 text-label-md font-bold active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <MapPin className="size-4 fill-primary/10" aria-hidden="true" />
              <span>View on Maps</span>
            </a>
          </div>
        </div>

        {/* Info Column */}
        <div className="md:w-1/2 flex flex-col justify-center text-left">
          <h3 className="text-headline-sm font-bold text-on-surface mb-1">{venue.name}</h3>
          <p className="text-on-surface-variant text-body-md mb-4 font-medium leading-relaxed">
            {venue.address}
          </p>
          <div className="flex items-start gap-2 text-on-surface-variant font-medium">
            <Bus className="size-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-label-md">{venue.transitInfo}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
