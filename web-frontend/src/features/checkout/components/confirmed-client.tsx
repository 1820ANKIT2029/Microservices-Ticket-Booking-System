"use client";

import { CheckCircle2, Download, Home, Mail, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { CheckoutEvent } from "@/features/checkout/types/checkout";

interface ConfirmedClientProps {
  event: CheckoutEvent;
  seatsList: string[];
  totalAmount: number;
}

export function ConfirmedClient({
  event,
  seatsList,
  totalAmount,
}: ConfirmedClientProps) {
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formattedSeats = seatsList.map((s) => {
    const parts = s.split("-");
    return parts[2] ? parts[0] + parts[2] : s;
  }).join(", ");

  const hasSeats = seatsList.length > 0;
  const ticketCategory = hasSeats && seatsList[0].startsWith("P-") ? "Platinum Premium" : "Gold Lower Tier";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface flex flex-col font-sans">
      {/* Main Container */}
      <main className="flex-grow pt-24 pb-20 px-4 md:px-16 flex flex-col items-center max-w-[1000px] mx-auto w-full">
        
        {/* Success Banner */}
        <section className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-16 h-16 bg-primary-container/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-primary font-sans mb-1.5">
            Booking Successful!
          </h1>
          <p className="text-[10px] font-extrabold text-on-surface-variant tracking-widest uppercase">
            Booking ID: EP-TX-8492067
          </p>
        </section>

        {/* Visual Ticket Stub Section */}
        <section className="w-full relative mb-12 group">
          <div className="bg-white rounded-2xl border border-outline-variant/40 shadow-md flex flex-col md:flex-row overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5">
            
            {/* Ticket Left Stub */}
            <div className="flex-grow p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-dashed border-outline-variant/50 relative">
              
              {/* Perforation circle mask look */}
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-surface-container-low border border-outline-variant/40 rounded-full z-10" />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-primary text-on-primary text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                    {ticketCategory}
                  </span>
                  <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                    Sports &bull; Cricket
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-extrabold text-on-surface font-sans">
                  {event.title}
                </h2>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-0.5">Date</span>
                    <span className="text-sm font-bold text-on-surface">{event.dateText}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-0.5">Time</span>
                    <span className="text-sm font-bold text-on-surface">7:30 PM IST</span>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-0.5">Venue</span>
                    <span className="text-sm font-bold text-on-surface flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      Wankhede Stadium, Mumbai
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-outline-variant/20 flex justify-between items-end">
                <div className="flex gap-6">
                  <div>
                    <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider block mb-0.5">Seats</span>
                    <span className="text-lg font-extrabold text-on-surface">{formattedSeats || "General"}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider block mb-0.5">Total Paid</span>
                  <span className="text-lg font-extrabold text-primary">{formatPrice(totalAmount)}</span>
                </div>
              </div>

            </div>

            {/* Ticket Right QR Stub */}
            <div className="w-full md:w-72 bg-surface-container p-6 md:p-8 flex flex-col items-center justify-center text-center">
              <div className="bg-white p-3.5 rounded-xl shadow-inner border border-outline-variant/30 mb-4">
                <Image 
                  alt="Ticket Entry QR Code Scanner Link" 
                  className="w-32 h-32 md:w-36 md:h-36 object-contain" 
                  src={`https://placehold.co/200x200/5400c3/ffffff/png?text=TICKET+EP-TX-8492067`}
                  unoptimized
                  width={144}
                  height={144}
                />
              </div>
              <p className="text-xs font-extrabold text-primary uppercase tracking-widest mb-1 font-sans">
                Scan at Entry
              </p>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                Gate 4, North Stand
              </p>
            </div>

          </div>
        </section>

        {/* Action Button Links */}
        <section className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center mb-12">
          <button 
            onClick={handlePrint}
            className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Download className="w-4 h-4" />
            Download Ticket (PDF)
          </button>
          
          <Link 
            href="/bookings"
            className="w-full sm:w-auto px-8 py-4 bg-white border border-outline-variant/60 text-primary rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-container active:scale-[0.98] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Clock className="w-4 h-4" />
            View My Bookings
          </Link>
          
          <Link 
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-white border border-outline-variant/60 text-on-surface-variant rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-container active:scale-[0.98] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </section>

        {/* Helpful Checkin info blocks */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
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
      <footer className="w-full py-6 text-center border-t border-outline-variant/40 bg-surface mt-auto">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
          &copy; 2024 EventPass Ticketing Services. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
