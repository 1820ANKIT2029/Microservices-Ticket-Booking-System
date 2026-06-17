"use client";

import React, { useCallback } from "react";
import { useVenueEditor }    from "../../hooks/useVenueEditor";
import { SidebarPanel }       from "./SidebarPanel";
import { SeatCanvas }         from "../canvas/SeatCanvas";
import { GenerateSeatsModal } from "./GenerateSeatsModal";
import { VenueSeatMapService } from "@/features/venue-seat-map";
import type { LocalVenue, LocalSection, LocalSeat, SeatGenerationConfig } from "../../types";

interface SeatMapEditorPageProps {
  venueId: number;
}

export function SeatMapEditorPage({ venueId }: SeatMapEditorPageProps) {
  const editor = useVenueEditor();
  const [toast, setToast] = React.useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // ── Load venue on mount ────────────────────────────────────────────────────

  React.useEffect(() => {
    if (!venueId) {
      // Start with blank canvas when no venueId provided
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await VenueSeatMapService.getVenue(venueId);
        const dto = res;

        const loadedVenue: LocalVenue = {
          id: dto.id,
          name: dto.name,
          mapWidth:  dto.mapWidth  ?? 1200,
          mapHeight: dto.mapHeight ?? 800,
          sections: [],
        };

        // Load sections
        try {
          const secRes = await VenueSeatMapService.getSections(venueId);
          const sections: LocalSection[] = (Array.isArray(secRes) ? secRes : []).map((s: any) => ({
            id:          s.id,
            venueId:     s.venueId,
            name:        s.name,
            sectionType: s.sectionType,
            x:           s.x,
            y:           s.y,
            width:       s.width,
            height:      s.height,
            rotation:    s.rotation,
            seats:       (s.seats ?? []).map((seat: any): LocalSeat => ({
              id:             seat.id,
              venueId:        seat.venueId,
              venueSectionId: seat.venueSectionId,
              rowLabel:       seat.rowLabel,
              seatNumber:     seat.seatNumber,
              seatType:       seat.seatType as LocalSeat["seatType"],
              x:              seat.x,
              y:              seat.y,
              width:          seat.width,
              height:         seat.height,
              rotation:       seat.rotation,
              shape:          seat.shape as LocalSeat["shape"],
              isAccessible:   seat.isAccessible,
              isActive:       seat.isActive,
            })),
          }));
          loadedVenue.sections = sections;
        } catch {
          // sections endpoint might not exist yet — that's fine
        }

        editor.loadVenue(loadedVenue);
      } catch {
        showToast("error", "Failed to load venue. Starting with blank canvas.");
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueId]);

  // ── Toast helper ───────────────────────────────────────────────────────────

  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Save layout ───────────────────────────────────────────────────────────

  const handleSave = useCallback(async () => {
    try {
      for (const section of editor.venue.sections) {
        const sectionPayload = {
          venueId:     editor.venue.id ?? 0,
          name:        section.name,
          sectionType: section.sectionType,
          totalSeats:  section.seats.length,
          x:           section.x,
          y:           section.y,
          width:       section.width,
          height:      section.height,
          rotation:    section.rotation,
        };

        let savedSectionId = section.id;

        if (section.id < 0) {
          // New section — create
          const r = await VenueSeatMapService.createSection(sectionPayload);
          savedSectionId = r.id;
          savedSectionId = r.id;
        } else {
          // Existing — update
          await VenueSeatMapService.updateSection(section.id, sectionPayload);
        }

        // Upsert seats
        const newSeats = section.seats.filter((s: any) => s.id < 0);
        if (newSeats.length > 0) {
          await VenueSeatMapService.createSeatsBatch(
            newSeats.map((seat: any) => ({
              venueId:        editor.venue.id ?? 0,
              venueSectionId: savedSectionId,
              rowLabel:       seat.rowLabel,
              seatNumber:     seat.seatNumber,
              seatType:       seat.seatType,
              x:              seat.x,
              y:              seat.y,
              width:          seat.width,
              height:         seat.height,
              rotation:       seat.rotation,
              shape:          seat.shape,
              isAccessible:   seat.isAccessible,
              isActive:       seat.isActive,
            }))
          );
        }

        // Update existing seats
        const existingSeats = section.seats.filter((s: any) => s.id > 0);
        await Promise.all(
          existingSeats.map((seat: any) =>
            VenueSeatMapService.updateSeat(seat.id, {
              rowLabel:    seat.rowLabel,
              seatNumber:  seat.seatNumber,
              seatType:    seat.seatType,
              x:           seat.x,
              y:           seat.y,
              width:       seat.width,
              height:      seat.height,
              rotation:    seat.rotation,
              shape:       seat.shape,
              isAccessible:seat.isAccessible,
              isActive:    seat.isActive,
            })
          )
        );
      }
      showToast("success", "Layout saved successfully!");
    } catch {
      showToast("error", "Failed to save. Check console for details.");
    }
  }, [editor.venue, showToast]);

  // ── Generate seats handler ─────────────────────────────────────────────────

  const handleGenerate = useCallback(
    (config: SeatGenerationConfig) => {
      if (editor.selectedSectionId !== null) {
        editor.generateSeats(editor.selectedSectionId, config);
      }
    },
    [editor]
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Loading venue…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-full relative"
      onKeyDown={editor.onKeyDown}
      onKeyUp={editor.onKeyUp}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      {/* Sidebar */}
      <SidebarPanel editor={editor} onSave={handleSave} />

      {/* Canvas area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top bar */}
        <div className="px-5 py-3 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-foreground">{editor.venue.name}</h1>
            <p className="text-[11px] text-muted-foreground">
              {editor.venue.mapWidth} × {editor.venue.mapHeight} px canvas ·{" "}
              {editor.venue.sections.length} section{editor.venue.sections.length !== 1 ? "s" : ""} ·{" "}
              {editor.venue.sections.reduce((acc, s) => acc + s.seats.length, 0)} seats
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono">Ctrl</kbd>
            <span>+click seats to multi-select</span>
          </div>
        </div>

        {/* Konva canvas */}
        <div className="flex-1 overflow-hidden">
          <SeatCanvas editor={editor} />
        </div>
      </div>

      {/* Generate seats modal */}
      <GenerateSeatsModal
        open={editor.isGenerateModalOpen}
        onClose={editor.closeGenerateModal}
        onGenerate={handleGenerate}
      />

      {/* Toast notifications */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold transition-all ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-destructive text-white"
          }`}
        >
          {toast.type === "success" ? (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
