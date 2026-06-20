"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";
import Konva from "konva";
import { useRouter } from "next/navigation";
import { ViewerSeatLayer } from "./ViewerSeatLayer";
import { VenueSeatMapService } from "@/features/venue-seat-map";
import { useSeatMapStore } from "../../store/seat-map.store";
import type { LocalVenue, LocalSection, LocalSeat } from "../../types";

// ── Shared parse helpers ──────────────────────────────────────────────────────

function parseSeat(seat: any): LocalSeat {
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

function parseSection(s: any): LocalSection {
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
  /** Called when the user's selection changes */
  onSelectionChange?: (selectedSeatIds: number[]) => void;
}

const MIN_SCALE = 0.05;
const MAX_SCALE = 4;
const SCALE_BY  = 1.08;

export function SeatMapViewerPage({ venueId, eventId, onSelectionChange }: SeatMapViewerPageProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef     = useRef<Konva.Stage>(null);

  // Zustand Store
  const store = useSeatMapStore();

  const [isLoading, setIsLoading]     = useState(!!venueId);
  const [error, setError]             = useState<string | null>(null);
  const [size, setSize]               = useState({ width: 800, height: 600 });

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

  // ── Load venue ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!venueId) return;
    setIsLoading(true);
    (async () => {
      try {
        // Parallel fetch — venue metadata + sections (with embedded seats)
        const [dto, secRes] = await Promise.all([
          VenueSeatMapService.getVenue(venueId),
          VenueSeatMapService.getSections(venueId).catch(() => []),
        ]);

        const loadedVenue: LocalVenue = {
          id:        dto.id,
          name:      dto.name,
          mapWidth:  dto.mapWidth  ?? 1200,
          mapHeight: dto.mapHeight ?? 800,
          sections:  (Array.isArray(secRes) ? secRes : []).map(parseSection),
        };

        store.loadVenue(loadedVenue);
      } catch {
        setError("Could not load venue map. Please try again.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [venueId]);

  // ── Fit to screen ─────────────────────────────────────────────────────────

  const fitToScreen = useCallback(() => {
    if (!store.venue.id) return;
    const padding = 40;
    const scaleX  = (size.width  - padding * 2) / store.venue.mapWidth;
    const scaleY  = (size.height - padding * 2) / store.venue.mapHeight;
    const ns = Math.min(scaleX, scaleY, 1);
    store.setScale(ns);
    store.setPos({
      x: (size.width  - store.venue.mapWidth  * ns) / 2,
      y: (size.height - store.venue.mapHeight * ns) / 2,
    });
  }, [store, size]);

  useEffect(() => { fitToScreen(); }, [fitToScreen]);

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
    store.setScale(ns);
    store.setPos({ x: pointer.x - mp.x * ns, y: pointer.y - mp.y * ns });
  }, [store]);

  // ── Seat selection ────────────────────────────────────────────────────────

  const handleSeatSelect = useCallback(
    (seatId: number) => {
      const isSelected = store.selectedSeatIds.includes(seatId);
      let nextSelected: number[];
      if (isSelected) {
        nextSelected = store.selectedSeatIds.filter((id) => id !== seatId);
      } else {
        if (store.selectedSeatIds.length >= 6) {
          alert("Maximum of 6 seats allowed per transaction");
          return;
        }
        nextSelected = [...store.selectedSeatIds, seatId];
      }
      store.setSelectedSeatIds(nextSelected);
      onSelectionChange?.(nextSelected);
    },
    [store, onSelectionChange]
  );

  const clearSelection = useCallback(() => {
    store.setSelectedSeatIds([]);
    onSelectionChange?.([]);
  }, [store, onSelectionChange]);

  // ── Find seat by id ───────────────────────────────────────────────────────

  const allSeats = store.venue.sections.flatMap((s) => s.seats) ?? [];
  const selectedSeatsDetails = allSeats.filter((s) => store.selectedSeatIds.includes(s.id));

  // ── Checkout Action ───────────────────────────────────────────────────────

  const handleProceed = useCallback(() => {
    if (store.selectedSeatIds.length === 0) return;

    const seats = store.venue.sections.flatMap((s) => s.seats);
    const selected = seats.filter((s) => store.selectedSeatIds.includes(s.id));
    const seatKeys = selected.map((seat) => {
      const isPremiumOrVip = seat.seatType === "VIP" || seat.seatType === "PREMIUM";
      const prefix = isPremiumOrVip ? "P" : "G";
      return `${prefix}-${seat.rowLabel}-${seat.seatNumber}`;
    });

    router.push(`/checkout?eventId=${eventId}&seats=${seatKeys.join(",")}`);
  }, [store.selectedSeatIds, store.venue.sections, eventId, router]);

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

  if (error || !store.venue.id) {
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
          <h1 className="text-lg font-bold text-foreground">{store.venue.name}</h1>
          <p className="text-xs text-muted-foreground">
            Select your seats · {allSeats.filter((s) => s.isActive).length} seats available
          </p>
        </div>

        {store.selectedSeatIds.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-primary">
                {store.selectedSeatIds.length} seat{store.selectedSeatIds.length > 1 ? "s" : ""} selected
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
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              Proceed →
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
              {Math.round(store.scale * 100)}%
            </span>
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-2">
            {[
              { color: "#22c55e", label: "Available" },
              { color: "#3b82f6", label: "Selected" },
              { color: "#a855f7", label: "Accessible" },
              { color: "#6b7280", label: "Unavailable" },
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
            scaleX={store.scale}
            scaleY={store.scale}
            x={store.pos.x}
            y={store.pos.y}
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
                width={store.venue.mapWidth}
                height={store.venue.mapHeight}
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
              sections={store.venue.sections}
              selectedSeatIds={store.selectedSeatIds}
              onSeatSelect={handleSeatSelect}
            />
          </Stage>
        </div>

        {/* Right panel — selected seats summary */}
        {store.selectedSeatIds.length > 0 && (
          <aside className="w-64 shrink-0 border-l border-border bg-sidebar flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-bold text-foreground">Your Selection</h2>
              <p className="text-xs text-muted-foreground">
                {store.selectedSeatIds.length} seat{store.selectedSeatIds.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
              {selectedSeatsDetails.map((seat) => (
                <div
                  key={seat.id}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-muted text-xs"
                >
                  <div>
                    <p className="font-bold text-foreground">
                      Row {seat.rowLabel} · Seat {seat.seatNumber}
                    </p>
                    <p className="text-muted-foreground capitalize">
                      {seat.seatType.toLowerCase()}
                      {seat.isAccessible ? " · ♿" : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSeatSelect(seat.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border">
              <button
                onClick={handleProceed}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
              >
                Proceed to Checkout
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
