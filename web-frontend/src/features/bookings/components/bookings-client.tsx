"use client";

import { useState, useMemo } from "react";
import { BookingsFeatured } from "./bookings-featured";
import { BookingsSidebar } from "./bookings-sidebar";
import { BookingsList } from "./bookings-list";
import { useBookings } from "../hooks/useBookings";
import { Loader2 } from "lucide-react";

type TabType = "upcoming" | "past" | "cancelled";

export function BookingsClient() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [page, setPage] = useState(0);

  const { data, isLoading } = useBookings(page, 8);

  const bookings = data?.content || [];
  const totalPages = data?.totalPages || 0;


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
    if (isLoading) return "";
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

  if (isLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[400px]" role="status">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant font-semibold">Loading your bookings...</p>
      </div>
    );
  }

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
            onClick={() => {
              setActiveTab("upcoming");
              setPage(0);
            }}
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
            onClick={() => {
              setActiveTab("past");
              setPage(0);
            }}
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
            onClick={() => {
              setActiveTab("cancelled");
              setPage(0);
            }}
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
          <BookingsSidebar />
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 border border-outline-variant/50 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-on-surface">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 border border-outline-variant/50 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
