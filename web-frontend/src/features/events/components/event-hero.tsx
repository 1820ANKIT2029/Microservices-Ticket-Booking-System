import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { EventDetail } from "../types/event-detail";

interface EventHeroProps {
  event: EventDetail;
}

export function EventHero({ event }: EventHeroProps) {
  return (
    <section className="relative w-full h-[350px] md:h-[500px] overflow-hidden" aria-label="Event Banner">
      <Image
        src={event.imageUrl}
        alt={event.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Dark overlay with linear gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-black/25 z-0" />

      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end px-4 md:px-16 pb-8 text-on-surface">
        <div className="max-w-[1280px] mx-auto w-full text-left">
          <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-sm font-bold mb-3 inline-block uppercase tracking-wider">
            {event.category}
          </span>
          <h1 className="text-display-lg-mobile md:text-display-lg font-black leading-tight text-on-surface mb-4">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-on-surface-variant font-semibold text-label-md">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-primary" aria-hidden="true" />
              <span>{event.dateText}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" aria-hidden="true" />
              <span>{event.timeText}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              <span>{event.locationText}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
