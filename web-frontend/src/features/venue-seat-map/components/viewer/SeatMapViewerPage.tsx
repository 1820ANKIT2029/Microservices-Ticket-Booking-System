"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";
import Konva from "konva";
import { useRouter } from "next/navigation";
import { ViewerSeatLayer } from "./ViewerSeatLayer";
import { VenueSeatMapService } from "@/features/venue-seat-map";
import { useSeatMapStore } from "../../store/seat-map.store";
import type { LocalVenue, LocalSection, LocalSeat, SeatDTO, VenueSectionMapDTO, SessionSeatDTO } from "../../types";
import { EventService } from "@/features/events/api/service";
import type { TicketTypeResponseDto } from "@/features/events/types";
import type { ApiResponse } from "@/shared/types";
import { toast } from "sonner";
import { useAuthStore } from "@/shared/store/auth.store";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── Shared parse helpers ──────────────────────────────────────────────────────

function parseSeat(seat: SeatDTO): LocalSeat {
  return {
    id:             seat.id,
    venueId:        seat.venueId,
    venueSectionId: seat.venueSectionId,
    rowLabel:       seat.rowLabel   ?? "A",
    seatNumber:     seat.seatNumber ?? "1",
    seatType:       (seat.seatType  ?? "STANDARD") as LocalSeat["seatType"],
    x:              seat.x        ?? 0,
    y:              seat.y        ?? 0,
    width:          seat.width    ?? 24,
    height:         seat.height   ?? 24,
    rotation:       seat.rotation ?? 0,
    shape:          ((seat.shape  ?? "circle") as LocalSeat["shape"]),
    isAccessible:   seat.isAccessible ?? false,
    isActive:       seat.isActive     ?? true,
  };
}

function parseSection(s: VenueSectionMapDTO): LocalSection {
  return {
    id:          s.id,
    venueId:     s.venueId,
    name:        s.name,
    sectionType: s.sectionType ?? "STANDARD",
    x:           s.x        ?? 0,
    y:           s.y        ?? 0,
    width:       s.width    ?? 300,
    height:      s.height   ?? 200,
    rotation:    s.rotation ?? 0,
    seats:       (s.seats ?? []).map(parseSeat),
  };
}

interface SeatMapViewerPageProps {
  venueId: number;
  eventId: string;
  sessionId?: string;
  /** Called when the user's selection changes */
  onSelectionChange?: (selectedSeatIds: number[]) => void;
}

const MIN_SCALE = 0.05;
const MAX_SCALE = 4;
const SCALE_BY  = 1.08;

export function SeatMapViewerPage({ venueId, eventId, sessionId, onSelectionChange }: SeatMapViewerPageProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef     = useRef<Konva.Stage>(null);

  // Zustand Store Selectors
  const venue = useSeatMapStore((s) => s.venue);
  const loadVenue = useSeatMapStore((s) => s.loadVenue);
  const scale = useSeatMapStore((s) => s.scale);
  const pos = useSeatMapStore((s) => s.pos);
  const setScale = useSeatMapStore((s) => s.setScale);
  const setPos = useSeatMapStore((s) => s.setPos);
  const selectedSeatIds = useSeatMapStore((s) => s.selectedSeatIds);
  const setSelectedSeatIds = useSeatMapStore((s) => s.setSelectedSeatIds);
  const user = useAuthStore((s) => s.user);

  const [sessionSeats, setSessionSeats] = useState<SessionSeatDTO[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketTypeResponseDto[]>([]);

  const [isLoading, setIsLoading]     = useState(!!venueId);
  const [isProceeding, setIsProceeding] = useState(false);
  const [lastLoadedVenueId, setLastLoadedVenueId] = useState<number | null>(null);
  const [error, setError]             = useState<string | null>(null);
  const [size, setSize]               = useState({ width: 800, height: 600 });

  if (venueId !== lastLoadedVenueId) {
    setLastLoadedVenueId(venueId);
    setIsLoading(true);
  }

  // ── Container resize observer ──────────────────────────────────────────────

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setSize({ width: el.clientWidth, height: el.clientHeight })
    );
    ro.observe(el);
    setSize({ width: el.clientWidth, height: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // ── Load venue & session details ────────────────────────────────────────────

  useEffect(() => {
    if (!venueId) return;
    (async () => {
      try {
        setIsLoading(true);
        // Parallel fetch — venue metadata + sections (with embedded seats)
        const [dto, secRes] = await Promise.all([
          VenueSeatMapService.getVenue(venueId),
          VenueSeatMapService.getSections(venueId).catch(() => []),
        ]);

        const sectionsData = dto.sections && dto.sections.length > 0
          ? dto.sections
          : (Array.isArray(secRes) ? secRes : []);

        const loadedVenue: LocalVenue = {
          id:        dto.id,
          name:      dto.name,
          mapWidth:  dto.mapWidth  ?? 1200,
          mapHeight: dto.mapHeight ?? 800,
          sections:  sectionsData.map(parseSection),
        };

        loadVenue(loadedVenue);

        // Fetch session-specific seats and ticket types if sessionId is provided
        if (sessionId) {
          try {
            const [seatsRes, ticketTypesRes] = await Promise.all([
              VenueSeatMapService.getSessionSeats(sessionId).catch(() => []),
              EventService.getTicketTypesBySession(sessionId).catch(() => []),
            ]);
            setSessionSeats(seatsRes || []);
            setTicketTypes(ticketTypesRes || []);
          } catch (err) {
            console.error("Failed to load session seats or ticket types:", err);
          }
        }
      } catch {
        setError("Could not load venue map. Please try again.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [venueId, sessionId, loadVenue]);

  // ── Fit to screen ─────────────────────────────────────────────────────────

  const fitToScreen = useCallback(() => {
    if (!venue.id) return;
    const padding = 40;
    const scaleX  = (size.width  - padding * 2) / venue.mapWidth;
    const scaleY  = (size.height - padding * 2) / venue.mapHeight;
    const ns = Math.min(scaleX, scaleY, 1);
    setScale(ns);
    setPos({
      x: (size.width - venue.mapWidth * ns) / 2,
      y: (size.height - venue.mapHeight * ns) / 2,
    });
  }, [venue.id, venue.mapWidth, venue.mapHeight, size, setScale, setPos]);

  useEffect(() => {
    fitToScreen();
  }, [fitToScreen]);

  // ── Zoom ──────────────────────────────────────────────────────────────────

  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage    = stageRef.current;
    if (!stage) return;
    const oldScale = stage.scaleX();
    const pointer  = stage.getPointerPosition()!;
    const mp = { x: (pointer.x - stage.x()) / oldScale, y: (pointer.y - stage.y()) / oldScale };
    const dir      = e.evt.deltaY < 0 ? 1 : -1;
    const ns = Math.min(MAX_SCALE, Math.max(MIN_SCALE, oldScale * (dir > 0 ? SCALE_BY : 1 / SCALE_BY)));
    setScale(ns);
    setPos({ x: pointer.x - mp.x * ns, y: pointer.y - mp.y * ns });
  }, [setScale, setPos]);

  // ── Seat selection ────────────────────────────────────────────────────────

  const handleSeatSelect = useCallback(
    (seatId: number) => {
      const isSelected = selectedSeatIds.includes(seatId);
      let nextSelected: number[];
      if (isSelected) {
        nextSelected = selectedSeatIds.filter((id) => id !== seatId);
      } else {
        if (selectedSeatIds.length >= 6) {
          alert("Maximum of 6 seats allowed per transaction");
          return;
        }
        nextSelected = [...selectedSeatIds, seatId];
      }
      setSelectedSeatIds(nextSelected);
      onSelectionChange?.(nextSelected);
    },
    [selectedSeatIds, setSelectedSeatIds, onSelectionChange]
  );

  const clearSelection = useCallback(() => {
    setSelectedSeatIds([]);
    onSelectionChange?.([]);
  }, [setSelectedSeatIds, onSelectionChange]);

  // ── Find seat details and compile sold list ────────────────────────────────

  const allSeats = venue.sections.flatMap((s) => s.seats) ?? [];
  const selectedSeatsDetails = allSeats.filter((s) => selectedSeatIds.includes(s.id));

  const soldSeatIds = sessionSeats
    .filter((ss) => ss.status === "SOLD" || ss.status === "RESERVED")
    .map((ss) => ss.seatId);

  // Compute total price of selected seats
  const totalPrice = selectedSeatsDetails.reduce((sum, seat) => {
    // Find section of this seat
    const section = venue.sections.find((s) => s.seats.some((seatItem) => seatItem.id === seat.id));
    const ticketType = section ? ticketTypes.find((t) => t.venueSectionIds?.includes(section.id)) : undefined;
    return sum + (ticketType?.basePrice ?? 1200); // Default to 1200 as fallback
  }, 0);

  // ── Checkout Action ───────────────────────────────────────────────────────

  const handleProceed = useCallback(async () => {
    if (selectedSeatIds.length === 0 || !sessionId) return;

    setIsProceeding(true);
    const toastId = toast.loading("Booking your selected seats...");

    try {
      const seats = venue.sections.flatMap((s) => s.seats);
      const selected = seats.filter((s) => selectedSeatIds.includes(s.id));
      
      const bookingRef = crypto.randomUUID();
      const userId = user?.userId || "1";
      const eventSessionId = Number(sessionId);

      const seatsPayload = selected.map((seat) => {
        const sSeat = sessionSeats.find((ss) => ss.seatId === Number(seat.id));
        const section = venue.sections.find((s) => s.seats.some((seatItem) => seatItem.id === seat.id));
        const ticketType = section ? ticketTypes.find((t) => t.venueSectionIds?.includes(section.id)) : undefined;

        return {
          sessionSeatId: sSeat ? Number(sSeat.id) : 0,
          eventSessionId: Number(sessionId),
          seatId: Number(seat.id),
          ticketTypeId: ticketType ? Number(ticketType.id) : 0,
        };
      });

      const bookingPayload = {
        bookingRef,
        userId,
        eventSessionId,
        seats: seatsPayload,
      };

      // Call direct booking API
      const bookingRes = await VenueSeatMapService.createEventBooking(bookingPayload);

      // Load Razorpay script
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        toast.error("Failed to load Razorpay Payment Gateway SDK.", { id: toastId });
        return;
      }

      toast.success("Connecting to Razorpay Secure...", { id: toastId });

      const seatKeys = selected.map((seat) => {
        const isPremiumOrVip = seat.seatType === "VIP" || seat.seatType === "PREMIUM";
        const prefix = isPremiumOrVip ? "P" : "G";
        return `${prefix}-${seat.rowLabel}-${seat.seatNumber}`;
      });

      const options = {
        key: bookingRes.gatewayPublicApiKey || "rzp_test_dummy",
        amount: Math.round(Number(bookingRes.totalAmount) * 100), // in paise
        currency: bookingRes.currency || "INR",
        name: "EventPass",
        description: `Booking Reference: ${bookingRes.bookingRef}`,
        image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg",
        handler: function (response: any) {
          toast.success("Payment Successful!");
          router.push(`/checkout/confirmed?eventId=${eventId}&seats=${seatKeys.join(",")}&total=${bookingRes.totalAmount}&bookingId=${bookingRes.id}`);
        },
        prefill: {
          name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Guest Customer",
          email: user?.email || "guest@example.com",
          contact: user?.phoneNumber || "",
        },
        notes: {
          bookingRef: bookingRes.bookingRef,
          bookingId: String(bookingRes.id),
        },
        theme: {
          color: "#5400c3",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Failed to book seats:", err);
      toast.error(err.message || "Failed to book seats. They may have already been taken.", { id: toastId });
    } finally {
      setIsProceeding(false);
    }
  }, [selectedSeatIds, venue.sections, eventId, sessionId, sessionSeats, ticketTypes, totalPrice, user, router]);

  // ── Loading / error ───────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Loading seat map…</p>
        </div>
      </div>
    );
  }

  if (error || !venue.id) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <p className="text-4xl">🎭</p>
          <p className="text-sm font-semibold text-foreground">{error ?? "Venue not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-background to-muted/30 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">{venue.name}</h1>
          <p className="text-xs text-muted-foreground">
            Select your seats · {allSeats.filter((s) => s.isActive && !soldSeatIds.includes(s.id)).length} seats available
          </p>
        </div>

        {selectedSeatIds.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-primary">
                {selectedSeatIds.length} seat{selectedSeatIds.length > 1 ? "s" : ""} selected (Total: ₹{totalPrice})
              </p>
              <p className="text-[11px] text-muted-foreground">
                {selectedSeatsDetails.map((s) => `${s.rowLabel}${s.seatNumber}`).join(", ")}
              </p>
            </div>
            <button
              onClick={clearSelection}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-accent transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleProceed}
              disabled={isProceeding}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProceeding ? "Booking..." : "Book Tickets →"}
            </button>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative" ref={containerRef}>
          {/* Toolbar */}
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <button
              onClick={fitToScreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/80 backdrop-blur border border-border shadow-sm hover:bg-accent transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
              Fit
            </button>
            <span className="flex items-center px-2 py-1.5 rounded-lg text-xs font-mono bg-white/80 backdrop-blur border border-border shadow-sm">
              {Math.round(scale * 100)}%
            </span>
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-2">
            {[
              { color: "#22c55e", label: "Available" },
              { color: "#3b82f6", label: "Selected" },
              { color: "#a855f7", label: "Accessible" },
              { color: "#cbd5e1", label: "Sold Out" },
              { color: "#f59e0b", label: "VIP" },
              { color: "#ec4899", label: "Premium" },
            ].map(({ color, label }) => (
              <span
                key={label}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-white/80 backdrop-blur border border-border shadow-sm"
              >
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>

          <Stage
            ref={stageRef}
            width={size.width}
            height={size.height}
            scaleX={scale}
            scaleY={scale}
            x={pos.x}
            y={pos.y}
            draggable
            onWheel={handleWheel}
            style={{ background: "#f3ebfc", cursor: "grab" }}
            onClick={(e) => {
              if (e.target === stageRef.current) clearSelection();
            }}
          >
            {/* Map bg */}
            <Layer>
              <Rect
                x={0}
                y={0}
                width={venue.mapWidth}
                height={venue.mapHeight}
                fill="#ffffff"
                stroke="#ccc3da"
                strokeWidth={2}
                shadowColor="#5400c3"
                shadowBlur={20}
                shadowOpacity={0.06}
                cornerRadius={8}
                perfectDrawEnabled={false}
                listening={false}
              />
            </Layer>

            {/* Seats */}
            <ViewerSeatLayer
              sections={venue.sections}
              selectedSeatIds={selectedSeatIds}
              soldSeatIds={soldSeatIds}
              ticketTypes={ticketTypes}
              onSeatSelect={handleSeatSelect}
            />
          </Stage>
        </div>

        {/* Right panel — selected seats summary */}
        {selectedSeatIds.length > 0 && (
          <aside className="w-68 shrink-0 border-l border-border bg-sidebar flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/40">
              <h2 className="text-sm font-bold text-foreground font-sans">Your Selection</h2>
              <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                {selectedSeatIds.length} seat{selectedSeatIds.length > 1 ? "s" : ""} selected
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 no-scrollbar">
              {selectedSeatsDetails.map((seat) => {
                const section = venue.sections.find((s) => s.seats.some((seatItem) => seatItem.id === seat.id));
                const ticketType = section ? ticketTypes.find((t) => t.venueSectionIds?.includes(section.id)) : undefined;
                const price = ticketType?.basePrice ?? 1200;

                return (
                  <div
                    key={seat.id}
                    className="flex flex-col gap-1 p-3 rounded-xl bg-surface-container border border-outline-variant/35 text-xs text-left"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-foreground">
                        Row {seat.rowLabel} · Seat {seat.seatNumber}
                      </p>
                      <button
                        onClick={() => handleSeatSelect(seat.id)}
                        disabled={isProceeding}
                        className="text-muted-foreground hover:text-destructive transition-colors text-sm font-bold disabled:opacity-50"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span className="capitalize">
                        {ticketType?.name || seat.seatType.toLowerCase()}
                        {seat.isAccessible ? " · ♿" : ""}
                      </span>
                      <span className="font-bold text-primary font-sans text-sm">
                        ₹{price}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-border bg-muted/20 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-on-surface">Total Pay</span>
                <span className="font-bold text-primary text-base font-sans">₹{totalPrice}</span>
              </div>
              <button
                onClick={handleProceed}
                disabled={isProceeding}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all active:scale-[0.98] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProceeding ? "Booking seats..." : "Book Tickets"}
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
