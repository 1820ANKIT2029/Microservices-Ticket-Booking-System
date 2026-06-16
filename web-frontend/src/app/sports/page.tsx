"use client";

import { Footer } from "@/features/homepage/components/footer";
import { SportsHero } from "@/features/sports-explorer/components/sports-hero";
import { LiveScores } from "@/features/sports-explorer/components/live-scores";
import { SportsContentSection } from "@/features/sports-explorer/components/sports-content-section";
import { RecommendedSports } from "@/features/sports-explorer/components/recommended-sports";
import { MobileBottomNav } from "@/features/homepage/components/mobile-bottom-nav";

export default function SportsPage() {
  return (
    <>
      <main id="main-content" className="w-full max-w-7xl mx-auto px-4 md:px-16 pt-24 pb-24 md:pb-8 flex-1">
        <SportsHero />
        <div className="mt-8">
          <LiveScores />
        </div>
        <SportsContentSection />
        <div className="mt-8">
          <RecommendedSports />
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
