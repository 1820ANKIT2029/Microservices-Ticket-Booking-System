import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, MoreHorizontal } from "lucide-react";
import { Booking } from "../types/bookings";

interface BookingsFeaturedProps {
  booking: Booking;
}

export function BookingsFeatured({ booking }: BookingsFeaturedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ticketUrl = `/checkout/confirmed?bookingId=${booking.id}`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="group w-full">
      <div className="glass-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col md:flex-row h-full border border-outline-variant/30 bg-surface-container-lowest">
        {/* Event Image */}
        <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden">
          <Image
            src={booking.imageUrl}
            alt={booking.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            unoptimized
          />
          <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-on-primary rounded-lg font-semibold text-xs tracking-wide shadow-md">
            Next Event
          </div>
        </div>

        {/* Content Info */}
        <div className="p-6 md:p-8 flex flex-col justify-between md:w-3/5 gap-6">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="font-semibold text-xs text-primary uppercase tracking-wider">
                {booking.category} Festival
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/80 text-on-secondary-container font-semibold text-xs border border-outline-variant/20">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                Confirmed
              </span>
            </div>
            <h2 className="font-bold text-2xl text-on-surface mb-4 leading-tight">
              {booking.title}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <Calendar className="size-5 text-primary shrink-0" aria-hidden="true" />
                <span className="text-sm md:text-base font-medium">
                  {booking.dateText}
                </span>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant">
                <MapPin className="size-5 text-primary shrink-0" aria-hidden="true" />
                <span className="text-sm md:text-base font-medium">
                  {booking.location}
                </span>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex gap-3 items-center">
            <Link
              href={ticketUrl}
              className="flex-grow inline-flex items-center justify-center bg-primary text-on-primary py-3 px-6 rounded-lg font-semibold text-sm hover:opacity-90 active:scale-98 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label={`View Ticket for ${booking.title}`}
            >
              View Ticket
            </Link>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 border border-outline-variant/60 rounded-lg hover:bg-surface-container-low transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-on-surface-variant cursor-pointer"
                aria-label="More options"
                aria-haspopup="true"
                aria-expanded={isOpen}
              >
                <MoreHorizontal className="size-5" />
              </button>
              {isOpen && (
                <div
                  className="absolute right-0 bottom-full mb-2 w-48 bg-surface-container-lowest border border-outline-variant/30 rounded-lg shadow-lg py-1 z-10 animate-in fade-in slide-in-from-bottom-2 duration-200"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <Link
                    href={ticketUrl}
                    className="block w-full text-left px-4 py-2 text-xs font-semibold hover:bg-surface-container-low text-on-surface-variant"
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                  >
                    Download PDF Ticket
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-xs font-semibold hover:bg-surface-container-low text-on-surface-variant cursor-pointer"
                    role="menuitem"
                    onClick={() => {
                      alert("Added to calendar!");
                      setIsOpen(false);
                    }}
                  >
                    Add to Calendar
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-xs font-semibold hover:bg-surface-container-low text-error cursor-pointer"
                    role="menuitem"
                    onClick={() => {
                      alert("Cancellation request submitted.");
                      setIsOpen(false);
                    }}
                  >
                    Request Cancellation
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
