import Image from "next/image";
import { HERO_SPORTS_EVENT } from "../constants/sports-data";

export function SportsHero() {
  const event = HERO_SPORTS_EVENT;

  return (
    <section className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden shadow-sm" aria-label="Featured Sports Event Banner">
      <Image
        src={event.imageUrl}
        alt={event.imageAlt}
        fill
        priority
        sizes="(max-width: 1280px) 100vw, 1280px"
        className="object-cover"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-10" />
      <div className="absolute inset-0 bg-black/10 z-0" />

      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8 w-full text-left">
        <div className="max-w-[700px] text-white">
          <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-label-sm font-bold mb-3 inline-block tracking-wider uppercase">
            {event.badge}
          </span>
          <h1 className="text-display-lg-mobile md:text-headline-lg font-black leading-tight text-white mb-2">
            {event.title}
          </h1>
          <p className="text-body-md text-white/95 font-medium mb-4">
            {event.description}
          </p>
          <div>
            <button
              type="button"
              className="bg-primary text-on-primary text-label-md font-bold px-6 py-2.5 rounded-lg hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all shadow-lg shadow-primary/20"
            >
              Get Early Access
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
