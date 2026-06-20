"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { RECOMMENDED_EVENTS } from "../constants/event-data";

export function Recommendations() {
  return (
    <section className="bg-surface-container-lowest py-16 mt-16 w-full border-t border-outline-variant/20" aria-labelledby="recommendations-title">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        <div className="flex justify-between items-end mb-8 text-left">
          <div>
            <h2 id="recommendations-title" className="text-headline-md font-bold text-on-surface">
              You Might Also Like
            </h2>
            <p className="text-on-surface-variant text-body-md mt-1 font-medium">
              Recommended sports and music events near you
            </p>
          </div>
          <Link
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-primary text-label-md font-semibold flex items-center gap-1 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-2"
          >
            <span>View All</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x scroll-smooth">
          {RECOMMENDED_EVENTS.map((event: { id: string; title: string; category: string; location: string; priceText: string; imageUrl: string; imageAlt: string }) => (
            <Link
              key={event.id}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="min-w-[280px] md:min-w-[320px] bg-card rounded-xl border border-outline-variant overflow-hidden group cursor-pointer hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all text-left p-1"
              role="listitem"
            >
              <div className="h-40 rounded-lg overflow-hidden relative">
                <Image
                  src={event.imageUrl}
                  alt={event.imageAlt}
                  fill
                  sizes="(max-width: 768px) 280px, 320px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <span className="text-primary text-label-sm font-bold uppercase tracking-wider">
                  {event.category}
                </span>
                <h4 className="text-headline-sm font-bold text-on-surface mt-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {event.title}
                </h4>
                <p className="text-on-surface-variant text-label-md mt-1 font-medium">
                  {event.location}
                </p>
                <div className="mt-4 flex justify-between items-center border-t border-outline-variant/10 pt-3">
                  <span className="font-black text-on-surface text-label-md">{event.priceText}</span>
                  <ChevronRight className="size-4 text-primary" aria-hidden="true" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
