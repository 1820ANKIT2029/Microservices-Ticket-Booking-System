"use client";

import { CheckCircle2, Download, Home, Mail, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Button } from "@/shared/components";
import { FormatUtils } from "@/shared/utils";
import type { BookingDTO, SessionSeatDTO, SeatDTO } from "@/features/venue-seat-map/types";
import type { Event, Venue } from "@/features/events/types";

interface ConfirmedClientProps {
  booking: BookingDTO;
  event: Event | null;
  venue: Venue | null;
  canvasVenue: any | null;
  sessionSeats: SessionSeatDTO[];
}

export function ConfirmedClient({
  booking,
  event,
  venue,
  canvasVenue,
  sessionSeats,
}: ConfirmedClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const formattedAmount = useMemo(() => {
    return FormatUtils.formatCurrency(booking.totalAmount);
  }, [booking.totalAmount]);

  // Flatten all seats from sections of the venue
  const allSeats: SeatDTO[] = [];
  if (canvasVenue?.sections) {
    for (const sec of canvasVenue.sections) {
      if (sec.seats) {
        allSeats.push(...sec.seats);
      }
    }
  }

  // Get active session details
  const activeSession = event?.sessions?.find((s) => String(s.id) === String(booking.eventSessionId));

  const formatSessionDate = (dateStr?: string) => {
    if (!dateStr) return "TBD";
    try {
      return FormatUtils.formatDate(dateStr);
    } catch {
      return dateStr;
    }
  };

  const formatSessionTime = (dateStr?: string) => {
    if (!dateStr) return "TBD";
    try {
      return FormatUtils.formatTime(dateStr);
    } catch {
      return dateStr;
    }
  };

  const eventDateText = activeSession ? formatSessionDate(activeSession.startDateTime) : "TBD";
  const eventTimeText = activeSession ? formatSessionTime(activeSession.startDateTime) : "7:30 PM";

  // Map each ticket to seat and section details
  const mappedTickets = (booking.tickets ?? []).map((ticket) => {
    const sessionSeat = sessionSeats.find((ss) => ss.id === ticket.sessionSeatId);
    const seat = sessionSeat ? allSeats.find((s) => s.id === sessionSeat.seatId) : null;
    const section = seat ? canvasVenue?.sections?.find((sec: any) => sec.id === seat.venueSectionId) : null;
    
    const ticketType = activeSession?.ticketTypes?.find((tt) => String(tt.id) === String(ticket.ticketTypeId));
    const ticketTypeName = ticketType?.name || "General Admission";
    
    return {
      id: ticket.id,
      ticketNumber: ticket.barCode || `T-${ticket.id}`,
      price: ticket.pricePaid || (booking.totalAmount / (booking.tickets?.length || 1)),
      status: ticket.status || "VALID",
      rowLabel: seat?.rowLabel || "N/A",
      seatNumber: seat?.seatNumber || "N/A",
      sectionName: section?.name || "General Admission",
      ticketTypeName,
      qrCode: ticket.qrCode || ticket.barCode || `EP-${booking.bookingRef}-${ticket.id}`,
    };
  });

  const fallbackTicket = {
    id: 0,
    ticketNumber: booking.bookingRef || `BK-${booking.id}`,
    price: booking.totalAmount,
    status: "VALID",
    rowLabel: "N/A",
    seatNumber: "N/A",
    sectionName: "General Admission",
    ticketTypeName: "Standard Entry",
    qrCode: `EP-${booking.bookingRef || booking.id}`,
  };

  const ticketsToRender = mappedTickets.length > 0 ? mappedTickets : [fallbackTicket];
  const activeTicket = ticketsToRender[activeIndex] || fallbackTicket;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface flex flex-col font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          header, footer, nav, button, .no-print {
            display: none !important;
          }
          body, main {
            background: white !important;
            color: #000 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-tickets-list {
            display: block !important;
            width: 100% !important;
          }
          .ticket-card-printable {
            page-break-inside: avoid !important;
            border: 1px solid rgba(0, 0, 0, 0.15) !important;
            background: white !important;
            margin-bottom: 2rem !important;
            display: flex !important;
            flex-direction: row !important;
          }
        }
      ` }} />

      {/* Main Container */}
      <main className="flex-grow pt-24 pb-20 px-4 md:px-16 flex flex-col items-center max-w-[1000px] mx-auto w-full">
        
        {/* Success Banner */}
        <section className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-16 h-16 bg-primary-container/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20 animate-pulse">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-primary font-sans mb-1.5">
            Booking Successful!
          </h1>
          <p className="text-[10px] font-extrabold text-on-surface-variant tracking-widest uppercase">
            Booking ID: {booking.bookingRef || `EP-TX-${booking.id}`}
          </p>
        </section>

        {/* Screen view: Carousel of Active Ticket */}
        <section className="print:hidden w-full relative mb-4 group flex flex-col items-center">
          <div className="bg-white rounded-2xl border border-outline-variant/40 shadow-md flex flex-col md:flex-row overflow-hidden transition-all duration-300 group-hover:shadow-lg w-full">
            
            {/* Ticket Left Stub */}
            <div className="flex-grow p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-dashed border-outline-variant/50 relative">
              
              {/* Perforation circle mask look */}
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-surface-container-low border border-outline-variant/40 rounded-full z-10" />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-primary text-on-primary text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                    {activeTicket.ticketTypeName}
                  </span>
                  <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                    {event?.eventType || "Event"}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-extrabold text-on-surface font-sans">
                  {event?.title || "Ticket Reservation"}
                </h2>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-0.5">Date</span>
                    <span className="text-sm font-bold text-on-surface">{eventDateText}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-0.5">Time</span>
                    <span className="text-sm font-bold text-on-surface">{eventTimeText}</span>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-0.5">Venue</span>
                    <span className="text-sm font-bold text-on-surface flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      {venue ? `${venue.name}, ${venue.city}` : "Wankhede Stadium, Mumbai"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-outline-variant/20 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider block mb-0.5">Seat Info</span>
                  <span className="text-base font-extrabold text-on-surface">
                    Sec {activeTicket.sectionName} &bull; Row {activeTicket.rowLabel}, Seat {activeTicket.seatNumber}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider block mb-0.5">Price Paid</span>
                  <span className="text-lg font-extrabold text-primary">{FormatUtils.formatCurrency(activeTicket.price)}</span>
                </div>
              </div>

            </div>

            {/* Ticket Right QR Stub */}
            <div className="w-full md:w-72 bg-surface-container p-6 md:p-8 flex flex-col items-center justify-center text-center">
              <div className="bg-white p-3.5 rounded-xl shadow-inner border border-outline-variant/30 mb-4">
                <Image 
                  alt="Ticket Entry QR Code Scanner Link" 
                  className="w-32 h-32 md:w-36 md:h-36 object-contain" 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(activeTicket.qrCode)}`}
                  unoptimized
                  width={144}
                  height={144}
                />
              </div>
              <p className="text-xs font-extrabold text-primary uppercase tracking-widest mb-1 font-sans">
                Scan at Entry
              </p>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                ID: {activeTicket.ticketNumber}
              </p>
            </div>

          </div>
        </section>

        {/* Screen view: Navigation buttons */}
        {ticketsToRender.length > 1 && (
          <div className="no-print flex items-center justify-between w-full max-w-[420px] mt-2 mb-8 bg-surface-container-high/40 p-2 rounded-full border border-outline-variant/20 shadow-sm">
            <button
              onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : ticketsToRender.length - 1))}
              className="px-4 py-2 border border-outline-variant/60 rounded-full font-bold text-xs hover:bg-surface-container active:scale-95 transition-all text-primary bg-white cursor-pointer border-none shadow-sm"
            >
              Previous Ticket
            </button>
            <span className="text-xs font-extrabold text-on-surface-variant px-3 py-1 bg-white rounded-full border border-outline-variant/10 shadow-inner">
              Ticket {activeIndex + 1} of {ticketsToRender.length}
            </span>
            <button
              onClick={() => setActiveIndex((prev) => (prev < ticketsToRender.length - 1 ? prev + 1 : 0))}
              className="px-4 py-2 border border-outline-variant/60 rounded-full font-bold text-xs hover:bg-surface-container active:scale-95 transition-all text-primary bg-white cursor-pointer border-none shadow-sm"
            >
              Next Ticket
            </button>
          </div>
        )}

        {/* Print-only: List of ALL Tickets */}
        <section className="hidden print:flex print:flex-col print:gap-8 print:w-full print:max-w-none w-full print-tickets-list">
          {ticketsToRender.map((ticket, index) => (
            <div key={ticket.id || index} className="bg-white rounded-2xl border border-outline-variant/50 shadow-none flex flex-row overflow-hidden w-full ticket-card-printable">
              
              {/* Left Stub */}
              <div className="flex-grow p-8 flex flex-col justify-between border-r border-dashed border-outline-variant/50 relative">
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-outline-variant/40 rounded-full z-10" />
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary text-on-primary text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                      {ticket.ticketTypeName}
                    </span>
                    <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                      {event?.eventType || "Event"}
                    </span>
                  </div>

                  <h2 className="text-2xl font-extrabold text-on-surface font-sans">
                    {event?.title || "Ticket Reservation"}
                  </h2>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-0.5">Date</span>
                      <span className="text-sm font-bold text-on-surface">{eventDateText}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-0.5">Time</span>
                      <span className="text-sm font-bold text-on-surface">{eventTimeText}</span>
                    </div>
                    <div className="flex flex-col col-span-2">
                      <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-0.5">Venue</span>
                      <span className="text-sm font-bold text-on-surface flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        {venue ? `${venue.name}, ${venue.city}` : "Wankhede Stadium, Mumbai"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-outline-variant/20 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider block mb-0.5">Seat Info</span>
                    <span className="text-base font-extrabold text-on-surface">
                      Sec {ticket.sectionName} &bull; Row {ticket.rowLabel}, Seat {ticket.seatNumber}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider block mb-0.5">Price Paid</span>
                    <span className="text-lg font-extrabold text-primary">{FormatUtils.formatCurrency(ticket.price)}</span>
                  </div>
                </div>
              </div>

              {/* Right Stub */}
              <div className="w-72 bg-surface-container p-8 flex flex-col items-center justify-center text-center">
                <div className="bg-white p-3.5 rounded-xl border border-outline-variant/30 mb-4">
                  <Image 
                    alt="Ticket Entry QR Code Scanner Link" 
                    className="w-36 h-36 object-contain" 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticket.qrCode)}`}
                    unoptimized
                    width={144}
                    height={144}
                  />
                </div>
                <p className="text-xs font-extrabold text-primary uppercase tracking-widest mb-1 font-sans">
                  Scan at Entry
                </p>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                  ID: {ticket.ticketNumber}
                </p>
              </div>

            </div>
          ))}
        </section>

        {/* Action Button Links */}
        <section className="no-print flex flex-col sm:flex-row gap-4 w-full justify-center items-center mb-12">
          <button 
            onClick={handlePrint}
            className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary border-none cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Ticket (PDF)
          </button>
          
          <Link 
            href="/bookings"
            className="w-full sm:w-auto px-8 py-4 bg-white border border-outline-variant/60 text-primary rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-container active:scale-[0.98] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary no-underline"
          >
            <Clock className="w-4 h-4" />
            View My Bookings
          </Link>
          
          <Link 
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-white border border-outline-variant/60 text-on-surface-variant rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-container active:scale-[0.98] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary no-underline"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </section>

        {/* Helpful Checkin info blocks */}
        <section className="no-print grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="bg-surface-container rounded-2xl p-5 flex items-start gap-4 border border-outline-variant/20 shadow-sm">
            <div className="w-10 h-10 bg-white border border-outline-variant/20 rounded-xl flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-on-surface">Check your email</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                We have dispatched a PDF receipt along with ticket check-in instructions to your registered email address.
              </p>
            </div>
          </div>

          <div className="bg-surface-container rounded-2xl p-5 flex items-start gap-4 border border-outline-variant/20 shadow-sm">
            <div className="w-10 h-10 bg-white border border-outline-variant/20 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-on-surface">Arrive 30 mins early</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Stadium safety checks and security screening protocols may take up to 30 minutes. Plan your arrival accordingly.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer copyright */}
      <footer className="no-print w-full py-6 text-center border-t border-outline-variant/40 bg-surface mt-auto">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
          &copy; 2026 EventPass Ticketing Services. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

