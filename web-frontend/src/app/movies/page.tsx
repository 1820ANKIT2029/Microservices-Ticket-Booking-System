"use client";

import { Footer } from "@/features/homepage/components/footer";
import { HeroCarousel } from "@/features/movies-explorer/components/hero-carousel";
import { FilterBar } from "@/features/movies-explorer/components/filter-bar";
import { TrendingMovies } from "@/features/movies-explorer/components/trending-movies";
import { RecommendedBento } from "@/features/movies-explorer/components/recommended-bento";
import { GenreGrid } from "@/features/movies-explorer/components/genre-grid";
import { ComingSoon } from "@/features/movies-explorer/components/coming-soon";
import { MobileBottomNav } from "@/features/homepage/components/mobile-bottom-nav";

export default function MoviesPage() {
  return (
    <>
      <main id="main-content" className="pt-20 pb-20 md:pb-0">
        <HeroCarousel />
        <FilterBar />
        <TrendingMovies />
        <RecommendedBento />
        <GenreGrid />
        <ComingSoon />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
