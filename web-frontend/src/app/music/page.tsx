"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Footer } from "@/features/homepage/components/footer";
import { MusicHero } from "@/features/music-explorer/components/music-hero";
import { GenreFilter } from "@/features/music-explorer/components/genre-filter";
import { WorldTours } from "@/features/music-explorer/components/world-tours";
import { UpcomingGigs } from "@/features/music-explorer/components/upcoming-gigs";
import { FestivalSpotlight } from "@/features/music-explorer/components/festival-spotlight";
import { NewsletterSignup } from "@/features/music-explorer/components/newsletter-signup";
import { MobileBottomNav } from "@/features/homepage/components/mobile-bottom-nav";

export default function MusicPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);


  return (
    <>
      <main id="main-content" className="pt-20 pb-20 md:pb-0">
        <MusicHero />
        <GenreFilter />
        <WorldTours />
        <UpcomingGigs />
        <FestivalSpotlight />
        <NewsletterSignup />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
