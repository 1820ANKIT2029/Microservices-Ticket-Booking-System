"use client";

import React from "react";
import type { VenueEditorAPI } from "../../hooks/useVenueEditor";
import { SectionPropertiesPanel } from "./SectionPropertiesPanel";
import type { SeatType } from "../../types";

interface SidebarPanelProps {
  editor: VenueEditorAPI;
  onSave: () => void;
}

const inputCls =
  "w-full px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-1.5">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function SidebarPanel({ editor, onSave }: SidebarPanelProps) {
  const { venue, selectedSection, selectedSectionId, selectedSeatIds } = editor;

  return (
    <aside className="w-72 shrink-0 h-full flex flex-col border-r border-border bg-sidebar overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border bg-gradient-to-b from-sidebar to-sidebar/80">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Seat Map Editor</p>
            <p className="text-[10px] text-muted-foreground">Admin Tool</p>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 no-scrollbar">

        {/* ── Venue Settings ── */}
        <SidebarSection title="Venue Settings">
          <Field label="Venue Name">
            <input
              type="text"
              className={inputCls}
              value={venue.name}
              onChange={(e) => editor.setVenueField("name", e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Map Width">
              <input
                type="number"
                min={400}
                max={5000}
                className={inputCls}
                value={venue.mapWidth}
                onChange={(e) => editor.setVenueField("mapWidth", Number(e.target.value))}
              />
            </Field>
            <Field label="Map Height">
              <input
                type="number"
                min={200}
                max={5000}
                className={inputCls}
                value={venue.mapHeight}
                onChange={(e) => editor.setVenueField("mapHeight", Number(e.target.value))}
              />
            </Field>
          </div>
        </SidebarSection>

        {/* ── Section Controls ── */}
        <SidebarSection title="Sections">
          <button
            onClick={editor.addSection}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Section
          </button>

          {/* Section list chips */}
          {venue.sections.length > 0 && (
            <div className="space-y-1 max-h-36 overflow-y-auto no-scrollbar">
              {venue.sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => editor.selectSection(s.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    s.id === selectedSectionId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-accent"
                  }`}
                >
                  <span>{s.name}</span>
                  <span className="opacity-70">{s.seats.length} seats</span>
                </button>
              ))}
            </div>
          )}
        </SidebarSection>

        {/* ── Seat Generation (only when section selected) ── */}
        {selectedSection && (
          <SidebarSection title="Seat Generation">
            <button
              onClick={editor.openGenerateModal}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-primary text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Generate Seats
            </button>
            <p className="text-[10px] text-muted-foreground text-center">
              Replaces existing seats in &ldquo;{selectedSection.name}&rdquo;
            </p>
          </SidebarSection>
        )}

        {/* ── Section Properties ── */}
        {selectedSection && (
          <SidebarSection title="Selected Section">
            <SectionPropertiesPanel
              section={selectedSection}
              selectedSeatIds={selectedSeatIds}
              onUpdate={(changes) => editor.updateSection(selectedSection.id, changes)}
              onDelete={() => editor.deleteSection(selectedSection.id)}
              onDeleteSelectedSeats={() => editor.deleteSelectedSeats(selectedSection.id)}
              onChangeSelectedSeatsType={(type: SeatType) =>
                editor.changeSelectedSeatsType(selectedSection.id, type)
              }
              onToggleSelectedSeatsAccessible={() =>
                editor.toggleSelectedSeatsAccessible(selectedSection.id)
              }
            />
          </SidebarSection>
        )}

        {/* ── Help tip ── */}
        {venue.sections.length === 0 && (
          <div className="rounded-xl bg-muted border border-dashed border-border p-4 text-center space-y-1">
            <p className="text-2xl">🗺️</p>
            <p className="text-xs font-semibold text-foreground">No sections yet</p>
            <p className="text-[11px] text-muted-foreground">
              Click &ldquo;Add Section&rdquo; to start building your venue layout.
            </p>
          </div>
        )}
      </div>

      {/* Footer — Save */}
      <div className="px-4 py-4 border-t border-border">
        <button
          onClick={onSave}
          disabled={editor.isSaving}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-[#7212ff] text-primary-foreground text-sm font-bold hover:opacity-90 disabled:opacity-60 transition-all shadow-md shadow-primary/20"
        >
          {editor.isSaving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Saving…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Layout
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
