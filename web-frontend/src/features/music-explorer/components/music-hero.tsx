import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { HERO_FESTIVAL } from "../constants/music-data";

export function MusicHero() {
  const festival = HERO_FESTIVAL;

  return (
    <section className="relative h-[600px] w-full flex items-end overflow-hidden" aria-label="Featured Concert Banner">
      <div className="absolute inset-0 z-0">
        <Image
          src={festival.imageUrl}
          alt={festival.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/30 z-0" />
      </div>

      <div className="relative z-10 px-6 md:px-16 pb-16 max-w-screen-2xl mx-auto w-full text-left">
        <div className="space-y-4 max-w-2xl text-on-surface">
          <span className="bg-primary-container text-on-primary-container text-label-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            {festival.badge}
          </span>
          <h1 className="text-display-lg-mobile md:text-display-lg font-black text-on-surface leading-tight">
            {festival.title}
          </h1>
          <p className="text-body-lg text-on-surface-variant font-medium">
            {festival.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-on-surface-variant font-semibold text-label-md pt-2">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-primary" aria-hidden="true" />
              <span>{festival.dateText}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              <span>{festival.locationText}</span>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap gap-4">
            <button
              type="button"
              className="bg-primary text-on-primary text-label-md font-bold px-8 py-3.5 rounded-full hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all shadow-lg shadow-primary/20"
            >
              Get Tickets
            </button>
            <button
              type="button"
              className="backdrop-blur-md bg-white/10 text-on-surface border border-outline-variant/30 text-label-md font-bold px-8 py-3.5 rounded-full hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
            >
              View Lineup
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
