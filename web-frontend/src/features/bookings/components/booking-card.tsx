"use client";

import Link from "next/link";
import { Calendar, MapPin, HelpCircle } from "lucide-react";
import { Booking } from "../types/bookings";

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const ticketUrl = `/checkout/confirmed?bookingId=${booking.id}`;

  if (booking.status === "cancelled") {
    return (
      <div className="bg-surface-container-lowest border border-error/20 p-6 rounded-xl flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md hover:border-error/40 shadow-sm">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <span className="font-bold text-xs text-error uppercase tracking-wider">
              {booking.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container font-semibold text-xs border border-error/10">
              Cancelled
            </span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-on-surface">{booking.title}</h3>
            <p className="text-sm text-on-surface-variant/90 mt-1.5 leading-relaxed">
              {booking.description || "This event was cancelled by the organizer. A full refund has been processed."}
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            alert(
              `Refund details for ${booking.title}: Refund of ${
                booking.pricePaid || "$45.00"
              } processed back to the original payment method.`
            )
          }
          type="button"
          className="w-full mt-6 bg-surface-container hover:bg-surface-container-high text-primary py-2.5 rounded-lg font-semibold text-sm transition-colors cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary border-none"
        >
          Refund Details
        </button>
      </div>
    );
  }

  if (booking.status === "completed") {
    return (
      <div className="group bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md hover:border-primary/40 shadow-sm opacity-90 hover:opacity-100">
        <div>
          <div className="relative h-40 overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={booking.imageUrl}
              alt={booking.imageAlt}
              className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            />
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <span className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">
                {booking.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant font-semibold text-xs border border-outline-variant/20">
                Completed
              </span>
            </div>
            <h3 className="font-bold text-lg text-on-surface truncate">{booking.title}</h3>
            <div className="space-y-2 text-on-surface-variant">
              <div className="flex items-center gap-2.5 text-xs md:text-sm">
                <Calendar className="size-4.5 text-on-surface-variant/70 shrink-0" aria-hidden="true" />
                <span className="font-medium">{booking.dateText}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs md:text-sm">
                <MapPin className="size-4.5 text-on-surface-variant/70 shrink-0" aria-hidden="true" />
                <span className="font-medium truncate">{booking.location}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <button
            onClick={() => alert(`Redirecting to book seats for ${booking.title}...`)}
            type="button"
            className="w-full border border-outline-variant hover:bg-surface-container-low text-on-surface-variant py-2.5 rounded-lg font-semibold text-sm transition-colors cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Rebook Similar
          </button>
        </div>
      </div>
    );
  }

  // Default: Confirmed status
  return (
    <div className="group bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md hover:border-primary/40 shadow-sm">
      <div>
        <div className="relative h-40 overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={booking.imageUrl}
            alt={booking.imageAlt}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <span className="font-bold text-xs text-primary uppercase tracking-wider">
              {booking.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-secondary-container/80 text-on-secondary-container font-semibold text-xs border border-outline-variant/20">
              Confirmed
            </span>
          </div>
          <h3 className="font-bold text-lg text-on-surface truncate">{booking.title}</h3>
          <div className="space-y-2 text-on-surface-variant">
            <div className="flex items-center gap-2.5 text-xs md:text-sm">
              <Calendar className="size-4.5 text-primary shrink-0" aria-hidden="true" />
              <span className="font-medium">{booking.dateText}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs md:text-sm">
              <MapPin className="size-4.5 text-primary shrink-0" aria-hidden="true" />
              <span className="font-medium truncate">{booking.location}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0 flex gap-3">
        <Link
          href={ticketUrl}
          className="flex-grow border border-primary hover:bg-primary/5 text-primary py-2.5 rounded-lg font-semibold text-sm transition-colors text-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          View Ticket
        </Link>
        <button
          onClick={() => alert(`Need help with ${booking.title}? Please check our Support page.`)}
          type="button"
          className="px-3 border border-outline-variant/60 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer text-on-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Get help with booking"
        >
          <HelpCircle className="size-5" />
        </button>
      </div>
    </div>
  );
}
