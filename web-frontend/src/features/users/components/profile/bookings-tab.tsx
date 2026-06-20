"use client";

import * as React from "react";
import { Ticket } from "lucide-react";
import { BOOKINGS_DATA } from "@/features/bookings/constants/bookings-data";
import { BookingCard } from "@/features/bookings/components/booking-card";

type BookingStatusTab = "upcoming" | "past" | "cancelled";

export function BookingsTab() {
  const [activeSubTab, setActiveSubTab] = React.useState<BookingStatusTab>("upcoming");

  // Filter logic
  const upcomingBookings = BOOKINGS_DATA.filter((b) => b.status === "confirmed");
  const pastBookings = BOOKINGS_DATA.filter((b) => b.status === "completed");
  const cancelledBookings = BOOKINGS_DATA.filter((b) => b.status === "cancelled");

  const getFilteredBookings = () => {
    switch (activeSubTab) {
      case "upcoming":
        return upcomingBookings;
      case "past":
        return pastBookings;
      case "cancelled":
        return cancelledBookings;
      default:
        return [];
    }
  };

  const currentBookings = getFilteredBookings();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <header className="mb-6">
        <h1 className="text-headline-md font-bold text-on-background mb-1">
          My Bookings
        </h1>
        <p className="text-body-md text-on-surface-variant">
          View your active passes, past event history, and cancellation receipts.
        </p>
      </header>

      {/* Sub tabs selector */}
      <div className="flex gap-2 border-b border-outline-variant/30 pb-3" role="tablist" aria-label="Booking states">
        {(["upcoming", "past", "cancelled"] as const).map((tab) => {
          const count =
            tab === "upcoming"
              ? upcomingBookings.length
              : tab === "past"
              ? pastBookings.length
              : cancelledBookings.length;

          const label =
            tab === "upcoming"
              ? "Upcoming"
              : tab === "past"
              ? "Past Events"
              : "Cancelled";

          const isActive = activeSubTab === tab;

          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-2 rounded-lg text-label-md font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              }`}
            >
              {label} <span className="opacity-75 font-normal">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Bookings Display Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        {currentBookings.length === 0 ? (
          <div className="sm:col-span-2 text-center py-16 border-2 border-dashed border-outline-variant/40 rounded-2xl bg-surface-container-low/40">
            <Ticket className="size-10 text-outline/50 mx-auto mb-3" />
            <h3 className="font-bold text-label-md text-on-surface">No bookings found</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              You don&apos;t have any {activeSubTab} bookings at the moment.
            </p>
          </div>
        ) : (
          currentBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        )}
      </div>
    </div>
  );
}
