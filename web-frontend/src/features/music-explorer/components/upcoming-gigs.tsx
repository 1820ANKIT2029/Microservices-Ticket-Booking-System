"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { UPCOMING_GIGS } from "../constants/music-data";
import { Button } from "@/shared/components/ui/button";
import { useEvents } from "@/features/events/hooks/queries/useEvents";
import type { Concert } from "@/features/events/types";

export function UpcomingGigs() {
  const [page, setPage] = useState(1);
  const limit = 4;
  const { data: apiConcerts, isLoading } = useEvents("concerts", page, limit);

  const displayedGigs = useMemo(() => {
    if (apiConcerts && apiConcerts.length > 0) {
      return apiConcerts.map((concert: any) => {
        return {
          id: String(concert.id),
          title: concert.title,
          imageUrl: concert.imageUrl || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=600",
          imageAlt: concert.imageAlt || concert.title,
          dateMonth: "OCT",
          dateDay: "24",
          venue: concert.subtitle || "Arena Hall",
          price: "From ₹999"
        };
      });
    }

    // Fallback: local pagination
    const start = (page - 1) * limit;
    return UPCOMING_GIGS.slice(start, start + limit);
  }, [apiConcerts, page, limit]);

  const hasNextPage = useMemo(() => {
    if (apiConcerts && apiConcerts.length > 0) {
      return apiConcerts.length === limit;
    }
    return (page * limit) < UPCOMING_GIGS.length;
  }, [apiConcerts, page, limit]);

  return (
    <section className="py-16 max-w-screen-2xl mx-auto px-6 md:px-16" aria-label="Upcoming Concerts">
      <h2 className="text-headline-md font-bold text-on-surface mb-8 text-left">
        Upcoming Gigs Near You
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedGigs.map((gig) => (
              <Link
                key={gig.id}
                href={`/events/${gig.id}`}
                className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <article
                  className="bg-card border border-outline-variant/20 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col justify-between h-full"
                >
                  {/* Poster Header with Date Badge */}
                  <div className="relative h-48 overflow-hidden shrink-0">
                    <Image
                      src={gig.imageUrl}
                      alt={gig.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-center shadow-md">
                      <span className="block font-bold text-primary text-[10px] uppercase tracking-widest leading-none">
                        {gig.dateMonth}
                      </span>
                      <span className="block font-black text-on-surface text-lg leading-none mt-1">
                        {gig.dateDay}
                      </span>
                    </div>
                  </div>

                  {/* Gig info body */}
                  <div className="p-5 flex-1 flex flex-col justify-between text-left">
                    <div>
                      <h3 className="text-headline-sm font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                        {gig.title}
                      </h3>
                      <p className="text-on-surface-variant font-semibold text-label-sm flex items-center gap-1.5 mt-2">
                        <MapPin className="size-4 text-primary shrink-0" aria-hidden="true" />
                        {gig.venue}
                      </p>
                    </div>

                    {/* Price & Book now action */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant/20">
                      <span className="font-black text-primary text-headline-sm">
                        {gig.price}
                      </span>
                      <span
                        className="bg-surface-container text-primary font-bold text-label-md px-5 py-2 rounded-full group-hover:bg-primary-container group-hover:text-on-primary transition-all active:scale-95"
                      >
                        Book Now
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 pt-4">
            <Button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              variant="outline"
              size="sm"
              className="cursor-pointer"
            >
              Previous
            </Button>
            <span className="text-sm font-bold text-on-surface-variant">
              Page {page}
            </span>
            <Button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNextPage}
              variant="outline"
              size="sm"
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
