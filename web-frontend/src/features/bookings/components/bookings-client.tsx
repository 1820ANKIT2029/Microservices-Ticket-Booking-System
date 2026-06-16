"use client";

import { useState, useMemo } from "react";
import { Booking, LoyaltyStats } from "../types/bookings";
import { BookingsFeatured } from "./bookings-featured";
import { BookingsSidebar } from "./bookings-sidebar";
import { BookingsList } from "./bookings-list";

interface BookingsClientProps {
  bookings: Booking[];
  loyaltyStats: LoyaltyStats;
}

type TabType = "upcoming" | "past" | "cancelled";

export function BookingsClient({ bookings, loyaltyStats }: BookingsClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");

  // Filter logic
  const upcomingBookings = useMemo(() => bookings.filter((b) => b.status === "confirmed"), [bookings]);
  const pastBookings = useMemo(() => bookings.filter((b) => b.status === "completed"), [bookings]);
  const cancelledBookings = useMemo(() => bookings.filter((b) => b.status === "cancelled"), [bookings]);

  // Determine featured booking: first upcoming confirmed booking, if any
  const featuredBooking = activeTab === "upcoming" ? upcomingBookings[0] : null;
  // List bookings: for upcoming, exclude the featured one
  const listBookings = useMemo(() => {
    switch (activeTab) {
      case "upcoming":
        return upcomingBookings.slice(1);
      case "past":
        return pastBookings;
      case "cancelled":
        return cancelledBookings;
      default:
        return [];
    }
  }, [activeTab, upcomingBookings, pastBookings, cancelledBookings]);

  const tabCountText = (tab: TabType) => {
    switch (tab) {
      case "upcoming":
        return `(${upcomingBookings.length})`;
      case "past":
        return `(${pastBookings.length})`;
      case "cancelled":
        return `(${cancelledBookings.length})`;
      default:
        return "";
    }
  };

  return (
    <div className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-16 py-8">
      {/* Header & Filter Section */}
      <header className="mb-8" role="banner">
        <h1 className="text-display-lg-mobile md:text-display-lg font-bold text-on-background tracking-tight mb-3">
          My Bookings
        </h1>
        <p className="text-body-lg text-on-surface-variant mb-6">
          Manage your upcoming events and view past ticket history.
        </p>
        <div className="flex flex-wrap gap-3 items-center" role="tablist" aria-label="Booking states">
          <button
            role="tab"
            aria-selected={activeTab === "upcoming"}
            aria-controls="bookings-panel"
            id="tab-upcoming"
            onClick={() => setActiveTab("upcoming")}
            className={`px-6 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              activeTab === "upcoming"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container/60 hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Upcoming {tabCountText("upcoming")}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "past"}
            aria-controls="bookings-panel"
            id="tab-past"
            onClick={() => setActiveTab("past")}
            className={`px-6 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              activeTab === "past"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container/60 hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Past Events {tabCountText("past")}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "cancelled"}
            aria-controls="bookings-panel"
            id="tab-cancelled"
            onClick={() => setActiveTab("cancelled")}
            className={`px-6 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              activeTab === "cancelled"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container/60 hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Cancelled {tabCountText("cancelled")}
          </button>
        </div>
      </header>

      {/* Bookings Grid (Asymmetric/Premium Layout) */}
      <div
        id="bookings-panel"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Main Section */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {featuredBooking && (
            <section aria-labelledby="featured-booking-heading">
              <h2 id="featured-booking-heading" className="sr-only">
                Next upcoming booking
              </h2>
              <BookingsFeatured booking={featuredBooking} />
            </section>
          )}

          <section aria-labelledby="other-bookings-heading" className={featuredBooking ? "mt-4" : ""}>
            <h2 id="other-bookings-heading" className="text-xl font-bold text-on-surface mb-6">
              {activeTab === "upcoming" ? "Other Bookings" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Bookings`}
            </h2>
            <BookingsList bookings={listBookings} />
          </section>
        </div>

        {/* Sidebar Section */}
        <div className="lg:col-span-4">
          <BookingsSidebar loyaltyStats={loyaltyStats} />
        </div>
      </div>
    </div>
  );
}
