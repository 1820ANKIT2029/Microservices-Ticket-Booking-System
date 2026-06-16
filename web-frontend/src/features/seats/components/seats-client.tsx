"use client";

import * as React from "react";
import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Check, MapPin, ZoomIn, ZoomOut, Info } from "lucide-react";
import Image from "next/image";
import type { CheckoutEvent } from "@/features/checkout/types/checkout";
import { EventService } from "@/features/events/services/event.service";

interface SeatsClientProps {
  event: CheckoutEvent;
  eventId: string;
}

// Deterministic sold out state to prevent React hydration mismatch warnings
const isSeatSoldOut = (section: "P" | "G", row: number, seat: number) => {
  const seed = section === "P" ? (row * 5 + seat * 3) : (row * 7 + seat * 2);
  return seed % 6 === 0; // Approx 16.6% sold out
};

// Memoized seat button component to prevent unnecessary re-renders of the 144 buttons
const SeatButton = React.memo(function SeatButton({
  seatId,
  isSold,
  isSelected,
  label,
  onClick,
  isGold
}: {
  seatId: string;
  isSold: boolean;
  isSelected: boolean;
  label: string;
  onClick: (seatId: string, price: number) => void;
  isGold?: boolean;
}) {
  const price = isGold ? 2500 : 4500;
  const sectionName = isGold ? "Gold" : "Platinum";
  const r = parseInt(seatId.split("-")[1], 10) + 1;
  const s = parseInt(seatId.split("-")[2], 10) + 1;

  const handleClick = () => {
    onClick(seatId, price);
  };

  return (
    <button
      disabled={isSold}
      onClick={handleClick}
      className={
        isGold
          ? `w-6 h-6 md:w-7 md:h-7 rounded-t-sm transition-all flex items-center justify-center text-[9px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isSold
                ? "bg-surface-variant border border-outline-variant/40 text-outline cursor-not-allowed"
                : isSelected
                ? "bg-primary-container text-on-primary-container ring-2 ring-primary scale-110 shadow"
                : "bg-on-primary-fixed-variant text-on-primary hover:scale-105 active:scale-95 shadow-sm"
            }`
          : `w-7 h-7 md:w-8 md:h-8 rounded-t-md transition-all flex items-center justify-center text-[10px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isSold
                ? "bg-surface-variant border border-outline-variant/40 text-outline cursor-not-allowed"
                : isSelected
                ? "bg-primary-container text-on-primary-container ring-2 ring-primary scale-110 shadow"
                : "bg-primary text-on-primary hover:scale-105 active:scale-95 shadow-sm"
            }`
      }
      aria-label={`${sectionName} seat row ${r} seat ${s} ${
        isSold ? "(Sold out)" : isSelected ? "(Selected)" : ""
      }`}
    >
      {isSelected ? (
        isGold ? (
          <Check className="w-2.5 h-2.5 text-on-primary-container stroke-[3]" />
        ) : (
          <Check className="w-3 h-3 text-on-primary-container stroke-[3]" />
        )
      ) : (
        label
      )}
    </button>
  );
});

export function SeatsClient({ event, eventId }: SeatsClientProps) {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<Map<string, number>>(new Map());
  const [zoomScale, setZoomScale] = useState(1);

  const toggleSeat = useCallback((seatId: string, price: number) => {
    setSelectedSeats((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(seatId)) {
        newMap.delete(seatId);
      } else {
        if (newMap.size >= 6) {
          alert("Maximum of 6 seats allowed per transaction");
          return prev;
        }
        newMap.set(seatId, price);
      }
      return newMap;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSeats(new Map());
  }, []);

  const handleProceed = useCallback(async () => {
    if (selectedSeats.size === 0) return;

    try {
      const seatPayloads = Array.from(selectedSeats.entries()).map(([seatKey]) => {
        const parts = seatKey.split("-");
        const row = parseInt(parts[1], 10);
        const col = parseInt(parts[2], 10);
        const seatId = (parts[0] === "P" ? 1000 : 2000) + row * 100 + col;

        return {
          eventSessionId: 1,
          seatId: seatId,
          status: "RESERVED" as const,
        };
      });

      await (EventService as any).lockSeats(seatPayloads);
    } catch (err) {
      console.warn("Backend seat locking failed. Proceeding with local checkout.", err);
    }

    const seatNames = Array.from(selectedSeats.keys()).join(",");
    router.push(`/checkout?eventId=${eventId}&seats=${seatNames}`);
  }, [selectedSeats, eventId, router]);

  // Pricing computations wrapped in useMemo to prevent recalculation on every render
  const totalPrice = useMemo(() => {
    let total = 0;
    selectedSeats.forEach((price) => {
      total += price;
    });
    return total;
  }, [selectedSeats]);

  const formattedTotalPrice = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(totalPrice);
  }, [totalPrice]);

  const platinumRows = 4;
  const platinumSeatsPerRow = 12;
  const goldRows = 6;
  const goldSeatsPerRow = 16;

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans">
      {/* Main Container */}
      <main className="flex-1 pt-24 pb-32 px-4 md:px-16 max-w-[1280px] mx-auto w-full">
        
        {/* Event Banner Details */}
        <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6" aria-labelledby="event-title">
          <div>
            <h1 id="event-title" className="text-2xl md:text-4xl font-extrabold text-primary font-sans leading-tight">
              {event.title}
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant font-medium flex items-center gap-1.5 mt-2">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              Wankhede Stadium, Mumbai | {event.dateText} &bull; 7:30 PM
            </p>
          </div>
          
          <div className="flex gap-2.5">
            <span className="px-4 py-1.5 bg-surface-container border border-outline-variant/30 text-primary rounded-full text-xs font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              BCCI Official
            </span>
            <span className="px-4 py-1.5 bg-surface-container border border-outline-variant/30 text-primary rounded-full text-xs font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Fast Selling
            </span>
          </div>
        </section>

        {/* Content columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Seat Picker Grid Block */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Map Legend */}
            <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/50 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div className="flex flex-wrap gap-4 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded" />
                  <span className="text-on-surface">Platinum (₹4,500)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-on-primary-fixed-variant rounded" />
                  <span className="text-on-surface">Gold (₹2,500)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-surface-variant border border-outline-variant/50 rounded" />
                  <span className="text-on-surface-variant">Sold Out</span>
                </div>
              </div>
              <div className="flex items-center gap-2 border-l border-outline-variant/30 pl-2">
                <button 
                  onClick={() => setZoomScale(prev => Math.min(prev + 0.1, 1.3))}
                  className="p-1.5 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant"
                  aria-label="Zoom in stadium map"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setZoomScale(prev => Math.max(prev - 0.1, 0.7))}
                  className="p-1.5 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant"
                  aria-label="Zoom out stadium map"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stadium Pitch & Seats Map */}
            <div 
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 relative overflow-hidden min-h-[500px] flex flex-col items-center shadow-sm select-none"
              style={{ perspective: "1000px" }}
            >
              {/* Pitch Screen representation */}
              <div className="w-full max-w-[400px] h-10 bg-surface-container border-b-[3px] border-primary rounded-t-[100%] flex items-center justify-center mb-16 shadow-inner">
                <span className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
                  THE PITCH
                </span>
              </div>

              {/* Scrollable Curved Map Wrapper */}
              <div 
                className="w-full overflow-x-auto pb-6 transition-transform duration-200 flex flex-col items-center gap-8 no-scrollbar"
                style={{ transform: `scale(${zoomScale}) rotateX(15deg)`, transformOrigin: "top center" }}
              >
                
                {/* Platinum Row Grid */}
                <div className="flex flex-col items-center gap-2.5">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-outline">
                    Platinum Premium (₹4,500)
                  </span>
                  
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${platinumSeatsPerRow}, minmax(0, 1fr))` }}>
                    {Array.from({ length: platinumRows }).map((_, r) => (
                      Array.from({ length: platinumSeatsPerRow }).map((_, s) => {
                        const seatId = `P-${r}-${s}`;
                        const isSold = isSeatSoldOut("P", r, s);
                        const isSelected = selectedSeats.has(seatId);

                        return (
                          <SeatButton
                            key={seatId}
                            seatId={seatId}
                            isSold={isSold}
                            isSelected={isSelected}
                            label={`${s + 1}`}
                            onClick={toggleSeat}
                          />
                        );
                      })
                    ))}
                  </div>
                </div>

                {/* Gold Row Grid */}
                <div className="flex flex-col items-center gap-2.5 mt-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-outline">
                    Gold Lower Tier (₹2,500)
                  </span>
                  
                  <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${goldSeatsPerRow}, minmax(0, 1fr))` }}>
                    {Array.from({ length: goldRows }).map((_, r) => (
                      Array.from({ length: goldSeatsPerRow }).map((_, s) => {
                        const seatId = `G-${r}-${s}`;
                        const isSold = isSeatSoldOut("G", r, s);
                        const isSelected = selectedSeats.has(seatId);

                        return (
                          <SeatButton
                            key={seatId}
                            seatId={seatId}
                            isSold={isSold}
                            isSelected={isSelected}
                            label={`${s + 1}`}
                            onClick={toggleSeat}
                            isGold
                          />
                        );
                      })
                    ))}
                  </div>
                </div>

              </div>

              {/* Instructions banner overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none">
                <div className="px-4 py-2 bg-on-surface/5 backdrop-blur-md rounded-full text-[10px] font-bold text-on-surface-variant flex items-center gap-1 border border-outline-variant/10 shadow-sm">
                  <Info className="w-3.5 h-3.5" />
                  Tap seats to select (Max 6)
                </div>
              </div>

            </div>

          </div>

          {/* Right Info sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Venue info Card */}
            <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-on-surface font-sans">Venue Info</h3>
              <div className="w-full h-32 rounded-xl overflow-hidden relative border border-outline-variant/20 bg-surface-container-lowest">
                <Image 
                  alt="Stadium View" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY4GoZ6bogHvBrJlYTX5ubDMc87Gqk0vlPQI9DsqUvCGZJzHrCbHhIjPP-NgF0DTZfJeS3pZSDucbB3Cnhau-rG6EsDoqo1jI-UnL8_tPXCdLnopo-t9H5qn7p7X8eIcu19dBmovWJmE_UxIzP6piE1l1cdm-r4bBnAot-k3yQ-VE_vOlVhEO8bJSLa2mtC5WIJ8w8ddVhRjrT2Xo8c2KZ89VEOUBf_6J9x2Fg9zXkCDdSciu8LazNLnABUUCRd8jqWedaJtqiYjc8"
                  unoptimized
                  fill
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-on-surface">Entry Gates 4 & 5</p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      North Pavilion entry for Platinum & Gold ticket holders. Verified photo ID is mandatory.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-on-surface">Reserved Parking</p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Exclusive parking slots can be pre-booked at checkout for ₹500.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 space-y-3 shadow-sm">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-outline">
                Important Guidelines
              </h3>
              <ul className="text-xs space-y-2 text-on-surface-variant leading-relaxed font-medium">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">&bull;</span>
                  No bags, helmets, or recording devices except phones allowed inside.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">&bull;</span>
                  Tickets are non-refundable within 24 hours of kickoff.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">&bull;</span>
                  Gates close 30 minutes after start of the match.
                </li>
              </ul>
            </div>

          </div>

        </div>

      </main>

      {/* Persistent sticky Bottom selection bar */}
      <footer 
        className={`fixed bottom-0 left-0 w-full z-50 bg-surface border-t border-outline-variant/50 shadow-2xl h-24 transition-transform duration-300 flex items-center px-4 md:px-16 ${
          selectedSeats.size > 0 ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-[1280px] mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="hidden sm:block">
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">
                Seats Selected
              </p>
              <div className="flex gap-1.5 overflow-x-auto max-w-[200px] no-scrollbar">
                {Array.from(selectedSeats.keys()).map((id) => {
                  const parts = id.split("-");
                  const displayName = parts[0] + parts[2];
                  return (
                    <span 
                      key={id} 
                      className="px-2 py-0.5 bg-primary-fixed text-primary text-[10px] rounded font-bold uppercase shrink-0 border border-primary/10"
                    >
                      {displayName}
                    </span>
                  );
                })}
              </div>
            </div>
            <div aria-live="polite">
              <p className="text-xs text-on-surface-variant font-bold" id="total-count">
                {selectedSeats.size} {selectedSeats.size === 1 ? "Seat" : "Seats"} Selected
              </p>
              <p className="text-primary font-bold text-xl font-sans" id="total-price">
                {formattedTotalPrice}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={clearSelection}
              className="px-5 py-2.5 font-bold text-xs text-on-surface-variant hover:bg-surface-container rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Clear
            </button>
            <button 
              onClick={handleProceed}
              className="px-8 md:px-12 py-3 bg-primary text-on-primary font-bold text-xs rounded-full shadow-md hover:bg-primary-container hover:text-on-primary-container hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
