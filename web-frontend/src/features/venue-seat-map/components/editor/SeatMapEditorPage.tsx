"use client";

import React, { useCallback } from "react";
import { useVenueEditor }    from "../../hooks/useVenueEditor";
import { SidebarPanel }       from "./SidebarPanel";
import { SeatCanvas }         from "../canvas/SeatCanvas";
import { GenerateSeatsModal } from "./GenerateSeatsModal";
import { VenueSeatMapService } from "@/features/venue-seat-map";
import type { LocalVenue, LocalSection, LocalSeat, SeatGenerationConfig, SeatDTO, VenueSectionMapDTO } from "../../types";

interface SeatMapEditorPageProps {
  venueId: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Parse a raw API section response into a LocalSection with safe defaults. */
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

/** Parse a raw API seat response into a LocalSeat with safe defaults. */
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

// ──────────────────────────────────────────────────────────────────────────────

export function SeatMapEditorPage({ venueId }: SeatMapEditorPageProps) {
  const editor = useVenueEditor();
  const [toast, setToast] = React.useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isLoading, setIsLoading] = React.useState(!!venueId);

  // ── Toast helper ───────────────────────────────────────────────────────────

  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Load venue on mount (parallel: getVenue + getSections) ────────────────

  React.useEffect(() => {
    if (!venueId) return;

    (async () => {
      try {
        // Fetch venue metadata and sections in parallel — 2 concurrent requests
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

        editor.loadVenue(loadedVenue);
      } catch {
        showToast("error", "Failed to load venue. Starting with blank canvas.");
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueId, showToast]);

  // ── Optimized save ────────────────────────────────────────────────────────
  //
  // Request budget per save (N sections, M total new seats, K existing seats):
  //
  //   Phase 1 — parallel deletions:
  //     • 1 DELETE /venues/:id/venue-sections/:sId   per deleted section
  //     • 1 DELETE …/seats/:seatId                   per deleted individual seat
  //
  //   Phase 2 — parallel section upserts (all sections at once):
  //     • 1 POST   /venue-sections                   per new section
  //     • 1 PUT    /venue-sections/:id               per existing section
  //
  //   Phase 3 — seat operations inside each section (parallel):
  //     • 1 POST   …/seats/batch                     per section with new seats
  //     • 1 PUT    …/seats/:id                       per existing seat (parallel)
  //
  //   Phase 4 — reload (2 concurrent requests):
  //     • 1 GET    /venues/:id
  //     • 1 GET    /venues/:id/venue-sections
  //
  // Total ≈ deletions + sections + 1-per-section-with-new-seats + existing-seat-updates + 2

  const handleSave = useCallback(async () => {
    const vid = editor.venue.id ?? 0;

    try {
      // ── Phase 1: Fire all pending deletes in parallel ──────────────────────
      //
      // Deleting a section server-side cascades to its seats, so we only track
      // individual seat deletions from sections that still exist in the editor.

      const { deletedSectionIds, deletedSeatIds } = editor;

      if (deletedSectionIds.length > 0 || deletedSeatIds.length > 0) {
        await Promise.all([
          ...deletedSectionIds.map((sId) =>
            VenueSeatMapService.deleteSection(vid, sId)
          ),
          ...deletedSeatIds.map(({ sectionId, seatId }) =>
            VenueSeatMapService.deleteSeat(vid, sectionId, seatId)
          ),
        ]);
      }

      // ── Phase 1.5: Update Venue metadata if changed ────────────────────────
      const isVenueDirty = 
        editor.venue.name !== editor.savedSnapshot?.name ||
        editor.venue.mapWidth !== editor.savedSnapshot?.mapWidth ||
        editor.venue.mapHeight !== editor.savedSnapshot?.mapHeight;

      if (isVenueDirty) {
        await VenueSeatMapService.updateVenueMetadata(vid, editor.venue.name, editor.venue.mapWidth, editor.venue.mapHeight);
      }

      // ── Phase 2: Upsert all sections in parallel ───────────────────────────
      //
      // Each section resolves its real server ID (either from the create response
      // or from its existing id), then immediately proceeds to seat operations
      // inside the same async task — no waiting between sections.

      await Promise.all(
        editor.venue.sections.map(async (section) => {
          const sectionPayload = {
            venueId:     vid,
            name:        section.name,
            sectionType: section.sectionType,
            totalSeats:  section.seats.length,
            x:           section.x,
            y:           section.y,
            width:       section.width,
            height:      section.height,
            rotation:    section.rotation,
          };

          // Determine the real (server-assigned) section ID
          let realSectionId: number;

          if (section.id < 0) {
            // New section — POST it and get the real ID back
            const created = await VenueSeatMapService.createSection(sectionPayload);
            realSectionId = created.id;
          } else {
            realSectionId = section.id;
            
            // ── Dirty check for section ──
            const originalSection = editor.savedSnapshot?.sections.find(s => s.id === section.id);
            const isDirty = !originalSection || 
              section.name !== originalSection.name ||
              section.sectionType !== originalSection.sectionType ||
              section.seats.length !== originalSection.seats.length ||
              section.x !== originalSection.x ||
              section.y !== originalSection.y ||
              section.width !== originalSection.width ||
              section.height !== originalSection.height ||
              section.rotation !== originalSection.rotation;

            if (isDirty) {
              // Existing section — PUT with full body including id
              await VenueSeatMapService.updateSection(vid, section.id, {
                ...sectionPayload,
                id: section.id,
              });
            }
          }

          // ── Phase 3: Seat operations (parallel within this section) ────────

          const newSeats  = section.seats.filter((s) => s.id < 0);
          const existingSeats = section.seats.filter((s) => s.id > 0);

          await Promise.all([
            // Batch-create all new seats in a single request
            newSeats.length > 0
              ? VenueSeatMapService.createSeatsBatch(
                  vid,
                  realSectionId,
                  newSeats.map((seat) => ({
                    venueId:        vid,
                    venueSectionId: realSectionId,
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
                )
              : Promise.resolve(null),

            // Update each existing seat in parallel — send full SeatDTO body
            // (id, venueId, venueSectionId required by backend modifySeat endpoint)
            ...existingSeats.map((seat) => {
              // ── Dirty check for seat ──
              const originalSection = editor.savedSnapshot?.sections.find(s => s.id === section.id);
              const originalSeat = originalSection?.seats.find(s => s.id === seat.id);
              
              const isDirty = !originalSeat || 
                seat.rowLabel !== originalSeat.rowLabel ||
                seat.seatNumber !== originalSeat.seatNumber ||
                seat.seatType !== originalSeat.seatType ||
                seat.x !== originalSeat.x ||
                seat.y !== originalSeat.y ||
                seat.width !== originalSeat.width ||
                seat.height !== originalSeat.height ||
                seat.rotation !== originalSeat.rotation ||
                seat.shape !== originalSeat.shape ||
                seat.isAccessible !== originalSeat.isAccessible ||
                seat.isActive !== originalSeat.isActive;

              if (!isDirty) return Promise.resolve(null);

              return VenueSeatMapService.updateSeat(vid, realSectionId, seat.id, {
                id:             seat.id,
                venueId:        vid,
                venueSectionId: realSectionId,
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
              });
            }),
          ]);
        })
      );

      showToast("success", "Layout saved!");

      // ── Phase 4: Reload to sync all server-assigned IDs (2 parallel GETs) ──

      try {
        const [venueDto, sections] = await Promise.all([
          VenueSeatMapService.getVenue(vid),
          VenueSeatMapService.getSections(vid).catch(() => []),
        ]);

        const reloaded: LocalVenue = {
          id:        venueDto.id,
          name:      venueDto.name,
          mapWidth:  venueDto.mapWidth  ?? editor.venue.mapWidth,
          mapHeight: venueDto.mapHeight ?? editor.venue.mapHeight,
          sections:  (Array.isArray(sections) ? sections : []).map(parseSection),
        };

        // loadVenue also resets deletedSectionIds & deletedSeatIds via LOAD_VENUE
        editor.loadVenue(reloaded);
      } catch {
        // Reload failure is non-fatal — deleted IDs are cleared anyway
        editor.clearDeletedIds();
      }
    } catch {
      showToast("error", "Save failed. Check the console for details.");
    }
  }, [editor, showToast]);

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
              {(editor.deletedSectionIds.length > 0 || editor.deletedSeatIds.length > 0) && (
                <span className="ml-1.5 text-destructive font-semibold">
                  · {editor.deletedSectionIds.length + editor.deletedSeatIds.length} pending delete{editor.deletedSectionIds.length + editor.deletedSeatIds.length !== 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <button
                onClick={editor.undo}
                disabled={editor.past.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-background border border-border shadow-sm hover:bg-accent disabled:opacity-40 disabled:hover:bg-background transition-colors"
                title="Undo (Ctrl+Z)"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Undo
              </button>
              <button
                onClick={editor.redo}
                disabled={editor.future.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-background border border-border shadow-sm hover:bg-accent disabled:opacity-40 disabled:hover:bg-background transition-colors"
                title="Redo (Ctrl+Y)"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                </svg>
                Redo
              </button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground border-l border-border pl-4">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono">Ctrl</kbd>
              <span>+click seats to multi-select</span>
            </div>
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
