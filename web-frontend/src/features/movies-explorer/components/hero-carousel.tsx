import Image from "next/image";
import { Play } from "lucide-react";
import Link from "next/link";
import { HERO_MOVIES } from "../constants/movies-data";

export function HeroCarousel() {
  const movie = HERO_MOVIES[0]; // Currently 1 featured movie in mock data

  return (
    <section className="relative h-[600px] w-full overflow-hidden" aria-label="Featured Movie Banner">
      {/* Slide Item */}
      <div className="relative w-full h-full">
        <Image
          src={movie.imageUrl}
          alt={movie.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Soft radial overlay + gradient to match page surface */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/40 z-0" />

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-16 pb-20 max-w-[1280px] mx-auto w-full">
          <div className="max-w-[700px] text-left">
            <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-sm font-bold mb-4 inline-block tracking-wider">
              {movie.badge}
            </span>
            <h1 className="text-display-lg-mobile md:text-display-lg font-black text-on-surface mb-6 leading-tight">
              {movie.title}
            </h1>
            <p className="text-body-lg text-on-surface-variant mb-8 font-medium">
              {movie.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/events/detail?id=${movie.id}`}
                className="bg-primary text-on-primary px-8 py-3.5 rounded-xl text-label-md font-bold hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all shadow-lg shadow-primary/20 inline-flex items-center justify-center"
              >
                Book Tickets
              </Link>
              <button
                type="button"
                className="bg-surface-container-highest/60 backdrop-blur-md border border-outline-variant/30 text-on-surface px-8 py-3.5 rounded-xl text-label-md font-bold hover:bg-surface-container-highest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all flex items-center gap-2"
              >
                <Play className="size-4 fill-on-surface" aria-hidden="true" />
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20" role="tablist" aria-label="Slideshow pagination">
        <button
          type="button"
          role="tab"
          aria-selected="true"
          aria-label="Slide 1"
          className="w-8 h-2 bg-primary rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all cursor-pointer"
        />
        <button
          type="button"
          role="tab"
          aria-selected="false"
          aria-label="Slide 2"
          className="w-2 h-2 bg-outline-variant rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all cursor-pointer"
        />
        <button
          type="button"
          role="tab"
          aria-selected="false"
          aria-label="Slide 3"
          className="w-2 h-2 bg-outline-variant rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all cursor-pointer"
        />
      </div>
    </section>
  );
}
