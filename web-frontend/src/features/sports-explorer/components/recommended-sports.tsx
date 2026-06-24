"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RECOMMENDED_SPORTS_EVENTS } from "../constants/sports-data";

export function RecommendedSports() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.75; // Scroll 75% of container width
      carouselRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="mt-16" aria-labelledby="recommended-title">
      <div className="flex items-center justify-between mb-6">
        <h2 id="recommended-title" className="text-headline-md font-bold text-on-surface">
          Recommended for You
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="p-2 rounded-full border border-outline-variant hover:bg-surface-container transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="p-2 rounded-full border border-outline-variant hover:bg-surface-container transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth no-scrollbar"
        role="region"
        aria-label="Recommended events carousel"
      >
        {RECOMMENDED_SPORTS_EVENTS.map((event) => (
          <Link
            key={event.id}
            href={`/events/detail?id=${event.id}`}
            className="min-w-[280px] md:min-w-[320px] snap-start group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1"
          >
            <div className="h-48 rounded-xl overflow-hidden mb-3 relative">
              <Image
                src={event.imageUrl}
                alt={event.imageAlt}
                fill
                sizes="(max-width: 768px) 280px, 320px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-on-surface text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                {event.category}
              </div>
            </div>
            <h4 className="text-label-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
              {event.title}
            </h4>
            <p className="text-label-sm text-on-surface-variant mt-1">
              {event.location} | {event.date}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
