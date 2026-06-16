"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { TRENDING_MOVIES } from "../constants/movies-data";
import { SectionHeader } from "@/shared/components/section-header";
import { Button } from "@/shared/components/ui/button";
import { useEvents } from "@/features/events/hooks/queries/useEvents";
import type { Movie } from "@/features/events/types";

export function TrendingMovies() {
  const [page, setPage] = useState(1);
  const limit = 4;
  const { data: apiMovies, isLoading } = useEvents("movies", page, limit);

  const displayedMovies = useMemo(() => {
    if (apiMovies && apiMovies.length > 0) {
      return apiMovies as Movie[];
    }
    // Fallback local pagination
    const start = (page - 1) * limit;
    return TRENDING_MOVIES.slice(start, start + limit) as unknown as Movie[];
  }, [apiMovies, page, limit]);

  const hasNextPage = useMemo(() => {
    if (apiMovies && apiMovies.length > 0) {
      return apiMovies.length === limit;
    }
    return (page * limit) < TRENDING_MOVIES.length;
  }, [apiMovies, page, limit]);

  return (
    <section className="max-w-[1280px] mx-auto px-6 md:px-16 py-10" aria-label="Trending Movies">
      <SectionHeader
        title="Trending Now"
        actionLabel="See All"
        actionHref="#"
        className="mb-8"
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2">
            {displayedMovies.map((movie) => {
              const rating = (movie as any).rating || "8.2/10";
              const details = movie.duration || (movie as any).formatOrLanguage || "2H 15M";

              return (
                <Link
                  key={movie.id}
                  href={`/events/${movie.id}`}
                  className="min-w-[240px] w-[240px] block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl transition-all"
                >
                  <article aria-label={`Trending movie: ${movie.title}. Rated ${rating}.`}>
                    {/* Image Poster Container */}
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-md group-hover:shadow-lg transition-all border border-outline-variant/10">
                      <Image
                        src={movie.imageUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600"}
                        alt={movie.imageAlt || movie.title}
                        fill
                        sizes="240px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                      {/* Star rating overlay */}
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white px-2 py-1 rounded-lg flex items-center gap-1 text-[12px] font-bold">
                        <Star className="size-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                        <span>{rating.split("/")[0]}</span>
                      </div>
                    </div>

                    {/* Info details */}
                    <h3 className="font-label-md font-semibold text-on-surface group-hover:text-primary transition-colors mb-1 truncate">
                      {movie.title}
                    </h3>
                    <p className="text-label-sm text-on-surface-variant font-medium">
                      {movie.genre} • {details}
                    </p>
                  </article>
                </Link>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-2">
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
