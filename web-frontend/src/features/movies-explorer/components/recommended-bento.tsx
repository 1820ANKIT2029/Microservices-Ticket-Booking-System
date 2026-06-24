import Image from "next/image";
import Link from "next/link";
import { RECOMMENDED_MOVIES } from "../constants/movies-data";
import { cn } from "@/shared/utils/cn";

export function RecommendedBento() {
  return (
    <section className="bg-surface-container py-16" aria-label="Recommendations">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16">
        {/* Section Title */}
        <div className="mb-8 text-left">
          <h2 className="text-headline-md font-bold text-on-surface mb-2">
            Recommended For You
          </h2>
          <p className="text-body-md text-on-surface-variant font-medium">
            Based on your love for Sci-Fi and Action
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[500px]">
          {RECOMMENDED_MOVIES.map((movie) => {
            const isLarge = movie.size === "large";
            const isMedium = movie.size === "medium";

            return (
              <Link
                key={movie.id}
                href={`/events/detail?id=${movie.id}`}
                className={cn(
                  "relative rounded-2xl overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all border border-outline-variant/10 shadow-sm hover:shadow-lg block",
                  isLarge && "md:col-span-2 md:row-span-2 h-[350px] md:h-auto",
                  !isLarge && !isMedium && "md:col-span-1 md:row-span-1 h-[180px] md:h-auto",
                  isMedium && "md:col-span-2 md:row-span-1 h-[180px] md:h-auto"
                )}
                aria-label={`Recommended movie: ${movie.title}.`}
              >
                <article className="w-full h-full relative">
                  {/* placehold.co Image */}
                  <Image
                    src={movie.imageUrl}
                    alt={movie.imageAlt}
                    fill
                    sizes={
                      isLarge
                        ? "(max-width: 768px) 100vw, 600px"
                        : isMedium
                        ? "(max-width: 768px) 100vw, 600px"
                        : "(max-width: 768px) 100vw, 300px"
                    }
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-6 text-left" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end text-left">
                    {isLarge ? (
                      <>
                        <h3 className="text-white text-headline-sm font-bold mb-2">
                          {movie.title}
                        </h3>
                        {movie.description && (
                          <p className="text-white/80 text-body-md font-medium mb-4">
                            {movie.description}
                          </p>
                        )}
                        <span
                          className="bg-white text-primary w-fit px-6 py-2 rounded-xl text-label-md font-bold group-hover:bg-primary-container group-hover:text-on-primary transition-all flex items-center justify-center"
                        >
                          Book Now
                        </span>
                      </>
                    ) : (
                      <>
                        <h3 className="text-white text-label-md font-bold leading-tight mb-1">
                          {movie.title}
                        </h3>
                        {movie.description && (
                          <p className="text-white/80 text-label-sm font-medium">
                            {movie.description}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
