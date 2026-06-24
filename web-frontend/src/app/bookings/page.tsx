"use client";

import { Footer } from "@/features/homepage/components/footer";
import { MobileBottomNav } from "@/features/homepage/components/mobile-bottom-nav";
import { BookingsClient } from "@/features/bookings/components/bookings-client";
import { Search } from "lucide-react";

export default function BookingsDashboardPage() {
  return (
    <>
      <main id="main-content" className="pt-20 pb-20 md:pb-0 min-h-screen bg-background">
        <BookingsClient />
      </main>
      <Footer />
      <MobileBottomNav />

      {/* Floating Action Button (FAB) for Mobile Quick Search */}
      <button
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 md:hidden z-40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Quick Search Events"
        type="button"
      >
        <Search className="size-6" aria-hidden="true" />
      </button>
    </>
  );
}
