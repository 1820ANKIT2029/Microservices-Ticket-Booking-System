import { FEATURED_MOVIES } from "@/features/homepage/constants/homepage-data";
import { MovieCard } from "./movie-card";
import { SectionHeader } from "@/shared/components/section-header";

export function FeaturedMovies() {
  return (
    <section
      className="py-20 px-4 md:px-16 max-w-[1280px] mx-auto"
      aria-label="Featured Movies"
      id="featured-movies"
    >
      <SectionHeader
        title="Featured Movies"
        subtitle="Blockbusters hitting the big screen this week"
        actionLabel="View All"
        actionHref="#"
      />
      <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6">
        {FEATURED_MOVIES.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
