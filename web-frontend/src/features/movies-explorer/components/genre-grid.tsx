import { Zap, Smile, Rocket, Skull, Heart, Clapperboard } from "lucide-react";
import Link from "next/link";
import { GENRES } from "../constants/movies-data";
import type { ReactNode } from "react";

const ICON_MAP: Record<string, ReactNode> = {
  Bolt: <Zap className="size-10 text-primary group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />,
  Smile: <Smile className="size-10 text-primary group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />,
  Rocket: <Rocket className="size-10 text-primary group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />,
  Skull: <Skull className="size-10 text-primary group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />,
  Heart: <Heart className="size-10 text-primary group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />,
  Drama: <Clapperboard className="size-10 text-primary group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />,
};

export function GenreGrid() {
  return (
    <section className="max-w-[1280px] mx-auto px-6 md:px-16 py-10" aria-label="Browse by Genre">
      <h2 className="text-headline-md font-bold text-on-surface mb-8 text-left">
        Browse by Genre
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {GENRES.map((genre) => (
          <Link
            key={genre.label}
            href="#"
            className="aspect-square block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:scale-105 active:scale-95 transition-all group"
            aria-label={`Genre: ${genre.label}`}
          >
            <article className="w-full h-full bg-surface-container-low rounded-2xl flex flex-col items-center justify-center gap-4 border border-outline-variant/20 hover:border-primary hover:bg-surface-container transition-all">
              {ICON_MAP[genre.icon]}
              <span className="font-label-md font-bold text-on-surface">
                {genre.label}
              </span>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
