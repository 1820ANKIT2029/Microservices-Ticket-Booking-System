"use client";

import * as React from "react";
import { Ticket, Loader2 } from "lucide-react";
import { BookingCard } from "@/features/bookings/components/booking-card";
import { useBookings } from "@/features/bookings/hooks/useBookings";

type BookingStatusTab = "upcoming" | "past" | "cancelled";

export function BookingsTab() {
  const [activeSubTab, setActiveSubTab] = React.useState<BookingStatusTab>("upcoming");
  const [page, setPage] = React.useState(0);

  const { data, isLoading } = useBookings(page, 6);

  const bookings = data?.content || [];
  const totalPages = data?.totalPages || 0;

  // Filter logic
  const upcomingBookings = bookings.filter((b) => b.status === "confirmed");
  const pastBookings = bookings.filter((b) => b.status === "completed");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16" role="status">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
        <p className="text-on-surface-variant text-sm font-semibold">Loading bookings...</p>
      </div>
    );
  }

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
              onClick={() => {
                setActiveSubTab(tab);
                setPage(0);
              }}
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
              You don&apos;t have any {activeSubTab} bookings on this page.
            </p>
          </div>
        ) : (
          currentBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-outline-variant/20">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3.5 py-1.5 border border-outline-variant/50 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            Previous
          </button>
          <span className="text-xs font-medium text-on-surface">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3.5 py-1.5 border border-outline-variant/50 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
