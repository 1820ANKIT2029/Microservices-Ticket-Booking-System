"use client";

import { HeroSection, HowItWorks, PremierClub, Footer, MobileBottomNav } from "@/shared/components";
import { FeaturedMovies } from "@/features/movies-explorer/components/featured-movies";
import { LiveSports } from "@/features/sports-explorer/components/live-sports";
import { ConcertsSection } from "@/features/music-explorer/components/concerts-section";

export default function HomePage() {
  return (
    <>
      <main id="main-content" className="pt-20 pb-20 md:pb-0">
        <HeroSection />
        <FeaturedMovies />
        <LiveSports />
        <ConcertsSection />
        <HowItWorks />
        <PremierClub />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
