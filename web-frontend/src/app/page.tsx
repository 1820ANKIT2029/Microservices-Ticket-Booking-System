"use client";

import { HeroSection } from "@/features/homepage/components/hero-section";
import { FeaturedMovies } from "@/features/homepage/components/featured-movies";
import { LiveSports } from "@/features/homepage/components/live-sports";
import { ConcertsSection } from "@/features/homepage/components/concerts-section";
import { HowItWorks } from "@/features/homepage/components/how-it-works";
import { PremierClub } from "@/features/homepage/components/premier-club";
import { Footer } from "@/features/homepage/components/footer";
import { MobileBottomNav } from "@/features/homepage/components/mobile-bottom-nav";

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
