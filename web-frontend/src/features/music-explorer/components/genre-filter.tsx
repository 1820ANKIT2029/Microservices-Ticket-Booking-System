"use client";

import { useState } from "react";
import { MUSIC_GENRES } from "../constants/music-data";
import { cn } from "@/shared/utils/cn";

export function GenreFilter() {
  const [activeGenre, setActiveGenre] = useState("All Genres");

  return (
    <section className="py-8 px-6 md:px-16 max-w-screen-2xl mx-auto" aria-label="Genre Selection">
      <div className="flex items-center justify-between mb-6 text-left">
        <h2 className="text-headline-md font-bold text-on-surface">
          Browse by Genre
        </h2>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {MUSIC_GENRES.map((genre) => {
          const isActive = genre === activeGenre;
          return (
            <button
              key={genre}
              type="button"
              onClick={() => setActiveGenre(genre)}
              className={cn(
                "flex-shrink-0 px-6 py-2.5 rounded-full text-label-md font-bold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer",
                isActive
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </section>
  );
}
