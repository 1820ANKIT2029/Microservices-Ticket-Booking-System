"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { SportEvent } from "../types/sports";
import { Button } from "@/shared/components/ui/button";

interface TrendingEventsProps {
  events: SportEvent[];
  page: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  isLoading?: boolean;
}

export function TrendingEvents({ events, page, onPageChange, hasNextPage, isLoading }: TrendingEventsProps) {
  return (
    <section aria-labelledby="trending-title">
      <div className="flex items-center justify-between mb-4">
        <h2 id="trending-title" className="text-headline-md font-bold text-on-background">
          Trending Events
        </h2>
        <Link
          href="#"
          className="text-primary text-label-md font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-2"
        >
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12 border border-outline-variant/30 rounded-xl bg-surface-container-low">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-outline-variant/60 rounded-xl bg-surface-container-low text-on-surface-variant">
                <p className="text-body-md font-semibold">No trending events found for this category.</p>
                <p className="text-label-sm mt-1">Please try exploring other sport types above.</p>
              </div>
            ) : (
              events.map((event) => {
                const badgeStyles =
                  event.tagType === "primary"
                    ? "text-primary bg-primary-fixed"
                    : event.tagType === "tertiary"
                    ? "text-tertiary bg-tertiary-fixed"
                    : "text-secondary bg-secondary-fixed";

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="group block bg-card border border-outline-variant rounded-xl overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <div className="relative md:w-48 h-36 md:h-auto overflow-hidden shrink-0">
                      <Image
                        src={event.imageUrl || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600"}
                        alt={event.imageAlt || event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 192px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-center text-left">
                      <div className="flex justify-between items-start mb-2 gap-4">
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider", badgeStyles)}>
                          {event.category}
                        </span>
                        <span className="text-on-surface-variant font-bold text-label-sm">
                          {event.priceText}
                        </span>
                      </div>
                      <h3 className="text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-label-sm text-on-surface-variant mt-1">
                        {event.location} • {event.date}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Pagination Controls */}
          {events.length > 0 && (
            <div className="flex justify-center items-center gap-4 pt-2">
              <Button
                onClick={() => onPageChange(Math.max(page - 1, 1))}
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
                onClick={() => onPageChange(page + 1)}
                disabled={!hasNextPage}
                variant="outline"
                size="sm"
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
