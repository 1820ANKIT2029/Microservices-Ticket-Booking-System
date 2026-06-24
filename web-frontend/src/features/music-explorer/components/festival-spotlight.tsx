import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FESTIVAL_SPOTLIGHTS } from "../constants/music-data";

export function FestivalSpotlight() {
  return (
    <section className="py-16 bg-surface-container-low overflow-hidden" aria-label="Festival Spotlight">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-16">
        {/* Header Block */}
        <div className="flex items-center justify-between mb-10 text-left">
          <h2 className="text-display-lg-mobile md:text-display-lg font-black text-on-surface">
            Festival Spotlight
          </h2>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              aria-label="Previous festival"
              className="p-2.5 rounded-full border border-outline hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              <ChevronLeft className="size-5 text-on-surface" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next festival"
              className="p-2.5 rounded-full border border-outline hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              <ChevronRight className="size-5 text-on-surface" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Horizontal Slider container */}
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
          {FESTIVAL_SPOTLIGHTS.map((fest) => (
            <article
              key={fest.id}
              className="min-w-[280px] sm:min-w-[400px] md:min-w-[550px] bg-card rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm flex flex-col md:flex-row"
            >
              {/* Left Column: Festival Image */}
              <div className="w-full md:w-1/2 h-56 md:h-auto relative shrink-0">
                <Image
                  src={fest.imageUrl}
                  alt={fest.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover"
                />
              </div>

              {/* Right Column: Festival Details */}
              <div className="p-6 md:w-1/2 flex flex-col justify-between text-left">
                <div>
                  <span className="text-tertiary font-bold tracking-widest text-[12px] uppercase">
                    {fest.dates}
                  </span>
                  <h3 className="text-headline-md font-bold text-on-surface mt-1">
                    {fest.title}
                  </h3>
                  <p className="text-on-surface-variant text-label-md font-medium mt-3 line-clamp-4">
                    {fest.description}
                  </p>
                </div>

                <Link
                  href={`/events/detail?id=${fest.id}`}
                  className="mt-6 border-2 border-primary text-primary font-bold text-label-md px-5 py-2.5 rounded-xl hover:bg-primary hover:text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all active:scale-95 cursor-pointer w-full md:w-fit block text-center"
                >
                  Explore Festival
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
