import type { Movie } from "@/features/movies-explorer/types";
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="min-w-[280px] group" id={`movie-${movie.id}`}>
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 shadow-lg">
        <Image
          src={movie.imageUrl}
          alt={movie.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {movie.badge && (
          <span className="absolute top-4 right-4 bg-primary/90 text-on-primary px-3 py-1 rounded-full text-label-sm font-bold backdrop-blur-md">
            {movie.badge}
          </span>
        )}
      </div>
      <h3 className="text-headline-sm font-semibold mb-1 group-hover:text-primary transition-colors">
        {movie.title}
      </h3>
      <p className="text-on-surface-variant text-label-md font-semibold mb-4">
        {movie.genre} • {movie.duration}
      </p>
      <Link
        href={`/events/${movie.id}`}
        className="w-full py-3 border border-primary text-primary rounded-xl text-label-md font-semibold hover:bg-primary-container hover:text-on-primary hover:border-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all h-auto block text-center"
      >
        Book Now
      </Link>
    </article>
  );
}
