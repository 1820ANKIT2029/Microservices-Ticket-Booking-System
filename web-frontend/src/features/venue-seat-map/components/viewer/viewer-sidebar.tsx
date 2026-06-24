import React from "react";
import { Calendar, Clock, Armchair, Trash2, Sparkles } from "lucide-react";
import { FormatUtils } from "@/shared/utils";
import type { LocalVenue } from "../../types";
import type { TicketTypeResponseDto } from "@/features/events/types";

interface ViewerSidebarProps {
  event: any;
  session: any;
  venue: LocalVenue;
  selectedSeatIds: number[];
  selectedSeatsDetails: any[];
  ticketTypes: TicketTypeResponseDto[];
  totalPrice: number;
  isProceeding: boolean;
  onClearSelection: () => void;
  onSeatSelect: (seatId: number) => void;
  onProceedClick: () => void;
}

export function ViewerSidebar({
  event,
  session,
  venue,
  selectedSeatIds,
  selectedSeatsDetails,
  ticketTypes,
  totalPrice,
  isProceeding,
  onClearSelection,
  onSeatSelect,
  onProceedClick,
}: ViewerSidebarProps) {
  return (
    <aside className="w-80 shrink-0 border-l border-border bg-sidebar flex flex-col overflow-hidden text-left">
      {/* Sidebar Header: Event context */}
      <div className="p-5 border-b border-border bg-muted/40">
        {event && (
          <div className="space-y-2">
            <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-block">
              {event.eventType || "Event"}
            </span>
            <h2 className="text-base font-black text-foreground line-clamp-1">{event.title}</h2>
          </div>
        )}
        
        {session && (
          <div className="mt-3 space-y-1.5 text-xs text-muted-foreground font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="size-3.5 text-primary" />
              <span>
                {FormatUtils.formatDate(session.startDateTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-3.5 text-primary" />
              <span>
                {FormatUtils.formatTime(session.startDateTime)}
              </span>
            </div>
          </div>
        )}
      </div>

      {selectedSeatIds.length === 0 ? (
        /* Sidebar Empty State */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-sidebar/30">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border border-border mb-4 shadow-inner">
            <Armchair className="size-8 text-muted-foreground/60 animate-pulse" />
          </div>
          <h3 className="text-sm font-bold text-foreground mb-1">Choose Your Seats</h3>
          <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
            Click on the available seats in the map layout to start reservation.
          </p>
        </div>
      ) : (
        /* Sidebar Ticket List */
        <>
          <div className="px-4 py-3 bg-muted/20 border-b border-border flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">
              {selectedSeatIds.length} Seat{selectedSeatIds.length > 1 ? "s" : ""} Selected
            </span>
            <button
              onClick={onClearSelection}
              className="text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
            {selectedSeatsDetails.map((seat) => {
              const section = venue.sections.find((s) => s.seats.some((seatItem) => seatItem.id === seat.id));
              const ticketType = section ? ticketTypes.find((t) => t.venueSectionIds?.includes(section.id)) : undefined;
              const price = ticketType?.basePrice ?? 1200;

              return (
                /* Ticket stub styling */
                <div
                  key={seat.id}
                  className="relative overflow-hidden bg-card border border-outline-variant/35 rounded-xl flex flex-col justify-between p-3.5 shadow-sm hover:border-primary/40 transition-all group"
                >
                  {/* Left and Right punchout circles for ticket stub look */}
                  <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-sidebar border-r border-outline-variant/35" />
                  <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-sidebar border-l border-outline-variant/35" />
                  
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                        {section?.name || "Seat"}
                      </p>
                      <p className="text-base font-black text-foreground">
                        Row {seat.rowLabel} · Seat {seat.seatNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => onSeatSelect(seat.id)}
                      disabled={isProceeding}
                      className="w-5 h-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-muted transition-all"
                      title="Remove seat"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-dashed border-outline-variant/30 flex justify-between items-center text-xs">
                    <span className="capitalize text-muted-foreground font-medium">
                      {ticketType?.name || seat.seatType.toLowerCase()} Ticket
                    </span>
                    <span className="font-extrabold text-primary text-sm">
                      ₹{price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar Booking Summary */}
          <div className="p-5 border-t border-border bg-muted/20 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex flex-col text-left">
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Payable</span>
                <span className="text-xl font-black text-primary">₹{totalPrice}</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">Incl. all taxes</span>
            </div>
            <button
              onClick={onProceedClick}
              disabled={isProceeding}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/95 active:scale-[0.98] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProceeding ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Securing tickets...</span>
                </>
              ) : (
                <>
                  <span>Book Seats Now</span>
                  <Sparkles className="size-4" />
                </>
              )}
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
