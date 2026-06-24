"use client";

import React, { useCallback } from "react";
import { useVenueEditor }    from "../../hooks/useVenueEditor";
import { SidebarPanel }       from "./SidebarPanel";
import { SeatCanvas }         from "../canvas/SeatCanvas";
import { useSeatMapSave }     from "../../hooks/useSeatMapSave";
import { GenerateSeatsModal } from "./GenerateSeatsModal";
import { VenueSeatMapService } from "@/features/venue-seat-map";
import type { LocalVenue, LocalSection, LocalSeat, SeatGenerationConfig, SeatDTO, VenueSectionMapDTO } from "../../types";

interface SeatMapEditorPageProps {
  venueId: number;
}

import { parseSection, parseSeat } from "../../utils/parsers";

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

  const { handleSave } = useSeatMapSave(editor, showToast);

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
