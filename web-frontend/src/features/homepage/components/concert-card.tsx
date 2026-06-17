import type { Concert } from "@/features/music-explorer/types";
import Image from "next/image";
import Link from "next/link";

interface ConcertCardProps {
  concert: Concert;
}

export function ConcertCard({ concert }: ConcertCardProps) {
  if (concert.variant === "featured") {
    return (
      <article
        className="md:col-span-7 relative rounded-[2rem] overflow-hidden group min-h-[400px] md:min-h-0"
        id={`concert-${concert.id}`}
      >
        {/* placehold.co Image */}
        <Image
          src={concert.imageUrl}
          alt={concert.imageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />

        <div className="absolute bottom-10 left-10 right-10 text-on-primary max-w-lg">
          {concert.subtitle && (
            <span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-label-sm font-bold mb-4 inline-block">
              {concert.subtitle}
            </span>
          )}
          <h3 className="text-headline-md md:text-display-lg font-bold mb-4">
            {concert.title}
          </h3>
          {concert.description && (
            <p className="text-body-md opacity-90 mb-6">
              {concert.description}
            </p>
          )}
          <Link
            href={`/events/${concert.id}`}
            className="bg-surface text-primary px-8 py-4 rounded-xl text-label-md font-semibold hover:bg-primary-container hover:text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all inline-block text-center"
          >
            Explore Tour Dates
          </Link>
        </div>
      </article>
    );
  }

  /* Compact variant */
  return (
    <Link
      href={`/events/${concert.id}`}
      className="relative rounded-[2rem] overflow-hidden group min-h-[200px] block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <article
        className="w-full h-full relative"
        id={`concert-${concert.id}`}
      >
        {/* placehold.co Image */}
        <Image
          src={concert.imageUrl}
          alt={concert.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
        <div className="absolute bottom-6 left-6 text-white text-left">
          <h4 className="text-headline-sm font-semibold">{concert.title}</h4>
          <p className="text-label-md opacity-80">{concert.subtitle}</p>
        </div>
      </article>
    </Link>
  );
}
