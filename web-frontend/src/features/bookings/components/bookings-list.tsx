"use client";

import { Booking } from "../types/bookings";
import { BookingCard } from "./booking-card";

interface BookingsListProps {
  bookings: Booking[];
}

export function BookingsList({ bookings }: BookingsListProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-outline-variant/30 rounded-xl bg-surface-container-low/30">
        <p className="text-on-surface-variant font-semibold text-lg mb-2">No bookings found</p>
        <p className="text-sm text-on-surface-variant/70">
          You don&apos;t have any bookings matching this category yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}
