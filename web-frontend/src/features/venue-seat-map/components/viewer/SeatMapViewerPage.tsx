"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";
import Konva from "konva";
import { useRouter } from "next/navigation";
import { ViewerSeatLayer } from "./ViewerSeatLayer";
import { ViewerSidebar } from "./viewer-sidebar";
import { VenueSeatMapService } from "@/features/venue-seat-map";
import { useSeatMapStore, seatMapStore } from "../../store/seat-map.store";
import type { LocalVenue, LocalSection, LocalSeat, SeatDTO, VenueSectionMapDTO, SessionSeatDTO, BookingResponseDTO } from "../../types";
import { EventService } from "@/features/events/api/service";
import type { TicketTypeResponseDto } from "@/features/events/types";
import { useAuthStore } from "@/shared/store/auth.store";
import { eventQueries } from "@/features/events/hooks/EventQueryService";
import { useSessionsByEvent } from "@/features/event-sessions";
import { Maximize2, ZoomIn, ZoomOut, Calendar, Clock, Armchair, Trash2, Sparkles } from "lucide-react";
import { useSeatBooking } from "../../hooks/useSeatBooking";

import { parseSection, parseSeat } from "../../utils/parsers";
interface SeatMapViewerPageProps {
  venueId: number;
  eventId: string;
  sessionId?: string;
  /** Called when the user's selection changes */
  onSelectionChange?: (selectedSeatIds: number[]) => void;
}

const MIN_SCALE = 0.05;
const MAX_SCALE = 4;
const SCALE_BY = 1.08;

export function SeatMapViewerPage({ venueId, eventId, sessionId, onSelectionChange }: SeatMapViewerPageProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  // Zustand Store Selectors
  const venue = useSeatMapStore((s) => s.venue);
  const loadVenue = seatMapStore.loadVenue;
  const scale = useSeatMapStore((s) => s.scale);
  const pos = useSeatMapStore((s) => s.pos);
  const setScale = seatMapStore.setScale;
  const setPos = seatMapStore.setPos;
  const selectedSeatIds = useSeatMapStore((s) => s.selectedSeatIds);
  const setSelectedSeatIds = seatMapStore.setSelectedSeatIds;
  const user = useAuthStore((s) => s.user);

  // Load Event and Sessions for sidebar context
  const { data: event } = eventQueries.useEvent(eventId);
  const { data: sessions = [] } = useSessionsByEvent(eventId);
  const session = sessionId ? sessions.find((s) => s.id === sessionId) : null;

  const [sessionSeats, setSessionSeats] = useState<SessionSeatDTO[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketTypeResponseDto[]>([]);

  const [isLoading, setIsLoading] = useState(!!venueId);
  const [lastLoadedVenueId, setLastLoadedVenueId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });

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
  }, [isLoading]);

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
          id: dto.id,
          name: dto.name,
          mapWidth: dto.mapWidth ?? 1200,
          mapHeight: dto.mapHeight ?? 800,
          sections: sectionsData.map(parseSection),
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
    if (!venue.id || size.width <= 0 || size.height <= 0) return;
    const padding = 40;
    const scaleX = (size.width - padding * 2) / venue.mapWidth;
    const scaleY = (size.height - padding * 2) / venue.mapHeight;
    const ns = Math.max(0.05, Math.min(scaleX, scaleY, 1));
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
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition()!;
    const mp = { x: (pointer.x - stage.x()) / oldScale, y: (pointer.y - stage.y()) / oldScale };
    const dir = e.evt.deltaY < 0 ? 1 : -1;
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

  // ── Find seat details and compile status lists ────────────────────────────────

  const allSeats = venue.sections.flatMap((s) => s.seats) ?? [];
  const selectedSeatsDetails = allSeats.filter((s) => selectedSeatIds.includes(s.id));

  const bookedSeatIds = sessionSeats
    .filter((ss) => ss.status === "BOOKED" || ss.status === "RESERVED")
    .map((ss) => ss.seatId);

  // Compute total price of selected seats
  const totalPrice = selectedSeatsDetails.reduce((sum, seat) => {
    // Find section of this seat
    const section = venue.sections.find((s) => s.seats.some((seatItem) => seatItem.id === seat.id));
    const ticketType = section ? ticketTypes.find((t) => t.venueSectionIds?.includes(section.id)) : undefined;
    return sum + (ticketType?.basePrice ?? 1200); // Default to 1200 as fallback
  }, 0);

  const { isProceeding, handleProceed } = useSeatBooking({
    eventId,
    sessionId,
    venue,
    sessionSeats,
    ticketTypes,
  });

  const onProceedClick = useCallback(() => {
    handleProceed(selectedSeatIds);
  }, [handleProceed, selectedSeatIds]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground font-bold tracking-wide">LOADING SEATING MAP…</p>
        </div>
      </div>
    );
  }

  if (error || !venue.id) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="text-center p-8 bg-surface-container border border-border rounded-2xl max-w-sm space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto text-3xl">
            🎭
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Failed to load venue</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{error ?? "Seating chart is currently offline or unavailable."}</p>
          </div>
          <button onClick={() => window.location.reload()} className="px-4 py-2 text-xs font-bold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors shadow">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background text-foreground select-none">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-background to-muted/30 flex items-center justify-between font-sans">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl">
            🎟️
          </div>
          <div className="text-left">
            <h1 className="text-base font-black text-foreground flex items-center gap-2">
              {venue.name}
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {allSeats.filter((s) => s.isActive && !bookedSeatIds.includes(s.id)).length} Seats Available
            </p>
          </div>
        </div>

        {/* Display selected counter in header */}
        {selectedSeatIds.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-foreground">
                {selectedSeatIds.length} seat{selectedSeatIds.length > 1 ? "s" : ""} selected · <span className="text-primary font-black">₹{totalPrice}</span>
              </p>
            </div>
            <button
              onClick={onProceedClick}
              disabled={isProceeding}
              className="sm:hidden px-4 py-2 text-xs font-bold rounded-lg bg-primary text-white hover:bg-primary/95 transition-all shadow-md disabled:opacity-50"
            >
              {isProceeding ? "Booking..." : `Book (${selectedSeatIds.length})`}
            </button>
          </div>
        )}
      </div>

      {/* Canvas and Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Seating Map Canvas */}
        <div className="flex-1 relative" ref={containerRef}>
          {/* Toolbar */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              onClick={fitToScreen}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white/80 text-foreground backdrop-blur border border-border shadow-md hover:bg-accent transition-colors"
              title="Reset Zoom & Center Map"
            >
              <Maximize2 className="size-3.5" />
              <span>Fit Screen</span>
            </button>

            <div className="flex items-center rounded-xl bg-white/80 text-foreground backdrop-blur border border-border shadow-md overflow-hidden divide-x divide-border">
              <button
                onClick={() => {
                  const stage = stageRef.current;
                  if (!stage) return;
                  const pointer = { x: size.width / 2, y: size.height / 2 };
                  const oldScale = stage.scaleX();
                  const ns = Math.min(MAX_SCALE, oldScale * SCALE_BY);
                  setScale(ns);
                  setPos({ x: pointer.x - (pointer.x - stage.x()) / oldScale * ns, y: pointer.y - (pointer.y - stage.y()) / oldScale * ns });
                }}
                className="p-2 hover:bg-accent transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="size-4 text-muted-foreground hover:text-foreground" />
              </button>
              <span className="px-2.5 py-1.5 text-xs font-bold font-mono min-w-[50px] text-center select-none text-muted-foreground">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => {
                  const stage = stageRef.current;
                  if (!stage) return;
                  const pointer = { x: size.width / 2, y: size.height / 2 };
                  const oldScale = stage.scaleX();
                  const ns = Math.max(MIN_SCALE, oldScale / SCALE_BY);
                  setScale(ns);
                  setPos({ x: pointer.x - (pointer.x - stage.x()) / oldScale * ns, y: pointer.y - (pointer.y - stage.y()) / oldScale * ns });
                }}
                className="p-2 hover:bg-accent transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="size-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-white/80 backdrop-blur border border-border rounded-2xl p-4 shadow-md max-w-sm text-left">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Map Legend</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { color: "#22c55e", label: "Available" },
                { color: "#3b82f6", label: "Selected" },
                { color: "#a855f7", label: "Accessible" },
                { color: "#cbd5e1", label: "Unavailable" },
                { color: "#f59e0b", label: "VIP Seat" },
                { color: "#ec4899", label: "Premium" },
              ].map(({ color, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-xs font-semibold text-foreground"
                >
                  <span className="w-3 h-3 rounded-md inline-block shadow-sm border border-black/10" style={{ background: color }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
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
              bookedSeatIds={bookedSeatIds}
              ticketTypes={ticketTypes}
              onSeatSelect={handleSeatSelect}
            />
          </Stage>
        </div>

        {/* Sidebar Summary */}
        <ViewerSidebar
          event={event}
          session={session}
          venue={venue}
          selectedSeatIds={selectedSeatIds}
          selectedSeatsDetails={selectedSeatsDetails}
          ticketTypes={ticketTypes}
          totalPrice={totalPrice}
          isProceeding={isProceeding}
          onClearSelection={clearSelection}
          onSeatSelect={handleSeatSelect}
          onProceedClick={onProceedClick}
        />
      </div>
    </div>
  );
}
