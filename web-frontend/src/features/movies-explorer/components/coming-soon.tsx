import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import { COMING_SOON_MOVIES } from "../constants/movies-data";

export function ComingSoon() {
  return (
    <section className="max-w-[1280px] mx-auto px-6 md:px-16 py-10 mb-16" aria-label="Coming Soon Movies">
      <h2 className="text-headline-md font-bold text-on-surface mb-8 text-left">
        Coming Soon
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {COMING_SOON_MOVIES.map((movie) => (
          <article
            key={movie.id}
            className="flex flex-col sm:flex-row gap-6 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 hover:shadow-md transition-shadow"
          >
            {/* Left side: Poster */}
            <Link
              href={`/events/detail?id=${movie.id}`}
              className="w-full max-w-[200px] mx-auto sm:w-1/3 sm:mx-0 aspect-[2/3] rounded-xl overflow-hidden shrink-0 relative border border-outline-variant/10 block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Image
                src={movie.imageUrl}
                alt={movie.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 200px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>

            {/* Right side: Movie Info & Action */}
            <div className="flex flex-col justify-between py-1 flex-1 text-left">
              <div>
                <Link href={`/events/detail?id=${movie.id}`} className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded block">
                  <h3 className="text-headline-sm font-bold text-on-surface hover:text-primary transition-colors">
                    {movie.title}
                  </h3>
                </Link>
                <p className="text-on-surface-variant text-body-md mt-1 font-medium">
                  {movie.releaseDate}
                </p>
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {movie.genres.map((g) => (
                    <span
                      key={g}
                      className="bg-surface-container-high text-on-surface px-3 py-1 rounded text-label-sm font-bold uppercase tracking-wider"
                    >
                      {g}
                    </span>
                  ))}
                  {movie.languages.map((l) => (
                    <span
                      key={l}
                      className="bg-surface-container-high text-on-surface px-3 py-1 rounded text-label-sm font-bold uppercase tracking-wider"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                className="bg-primary text-on-primary flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-label-md font-bold mt-6 hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all w-full md:w-fit"
              >
                <Bell className="size-4" aria-hidden="true" />
                Notify Me
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
