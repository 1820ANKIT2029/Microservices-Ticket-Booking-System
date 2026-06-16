import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WORLD_TOURS } from "../constants/music-data";

export function WorldTours() {
  return (
    <section className="py-16 bg-surface-container-lowest" aria-label="World Tours">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-16">
        {/* Header Block */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10 text-left">
          <div>
            <h2 className="text-display-lg-mobile md:text-display-lg font-black text-on-surface">
              World Tours
            </h2>
            <p className="text-body-md text-on-surface-variant font-medium mt-1">
              The biggest names in music are hitting the road this season.
            </p>
          </div>
          <Link
            href="#"
            className="text-primary font-bold text-label-md flex items-center gap-1.5 hover:underline decoration-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg px-2 py-1"
          >
            View All Tours
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {WORLD_TOURS.map((tour) => (
            <Link
              key={tour.id}
              href={`/events/${tour.id}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all border border-outline-variant/10 shadow-sm hover:shadow-xl"
              aria-label={`${tour.name}: ${tour.tourName} tour. ${tour.details}`}
            >
              <article className="w-full h-full relative">
                {/* Artist Image */}
                <Image
                  src={tour.imageUrl}
                  alt={tour.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                {/* Tour Info Block */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-left text-white z-10">
                  <span
                    className={`px-3 py-1 rounded-full text-label-sm font-bold mb-2 inline-block tracking-wider uppercase ${tour.badgeClass}`}
                  >
                    {tour.tourName}
                  </span>
                  <h3 className="text-headline-md font-bold leading-tight mb-1">
                    {tour.name}
                  </h3>
                  <p className="text-label-md font-medium opacity-85">
                    {tour.details}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
