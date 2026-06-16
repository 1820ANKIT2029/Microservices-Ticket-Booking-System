"use client";

import React from "react";
import type { LocalSection, SeatType } from "../../types";

interface SectionPropertiesPanelProps {
  section: LocalSection;
  selectedSeatIds: number[];
  onUpdate: (changes: Partial<Omit<LocalSection, "id" | "seats">>) => void;
  onDelete: () => void;
  onDeleteSelectedSeats: () => void;
  onChangeSelectedSeatsType: (type: SeatType) => void;
  onToggleSelectedSeatsAccessible: () => void;
}

const SECTION_TYPES = ["STANDARD", "PREMIUM", "VIP", "ECONOMY", "FLOOR"];
const SEAT_TYPES: SeatType[] = ["STANDARD", "PREMIUM", "VIP", "ECONOMY"];

const inputCls =
  "w-full px-2.5 py-1.5 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

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

export function SectionPropertiesPanel({
  section,
  selectedSeatIds,
  onUpdate,
  onDelete,
  onDeleteSelectedSeats,
  onChangeSelectedSeatsType,
  onToggleSelectedSeatsAccessible,
}: SectionPropertiesPanelProps) {
  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
          Section Properties
        </h3>
        <button
          onClick={onDelete}
          className="text-xs font-semibold text-destructive hover:text-destructive/80 transition-colors px-2 py-1 rounded-lg hover:bg-destructive/10"
        >
          Delete Section
        </button>
      </div>

      <div className="space-y-3">
        <Field label="Name">
          <input
            type="text"
            className={inputCls}
            value={section.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </Field>

        <Field label="Type">
          <select
            className={inputCls}
            value={section.sectionType}
            onChange={(e) => onUpdate({ sectionType: e.target.value })}
          >
            {SECTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        {/* Position + size grid */}
        <div className="grid grid-cols-2 gap-2">
          <Field label="X">
            <input
              type="number"
              className={inputCls}
              value={Math.round(section.x)}
              onChange={(e) => onUpdate({ x: Number(e.target.value) })}
            />
          </Field>
          <Field label="Y">
            <input
              type="number"
              className={inputCls}
              value={Math.round(section.y)}
              onChange={(e) => onUpdate({ y: Number(e.target.value) })}
            />
          </Field>
          <Field label="Width">
            <input
              type="number"
              min={60}
              className={inputCls}
              value={Math.round(section.width)}
              onChange={(e) => onUpdate({ width: Number(e.target.value) })}
            />
          </Field>
          <Field label="Height">
            <input
              type="number"
              min={40}
              className={inputCls}
              value={Math.round(section.height)}
              onChange={(e) => onUpdate({ height: Number(e.target.value) })}
            />
          </Field>
          <Field label="Rotation (°)">
            <input
              type="number"
              min={-360}
              max={360}
              className={inputCls}
              value={Math.round(section.rotation)}
              onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
            />
          </Field>
        </div>

        {/* Seat count badge */}
        <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
          <span className="text-xs text-muted-foreground">Total seats</span>
          <span className="text-sm font-bold text-primary">{section.seats.length}</span>
        </div>
      </div>

      {/* Selected-seat actions */}
      {selectedSeatIds.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {selectedSeatIds.length} seat{selectedSeatIds.length > 1 ? "s" : ""} selected
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onToggleSelectedSeatsAccessible}
              className="py-2 rounded-lg text-xs font-semibold border border-[#a855f7] text-[#a855f7] hover:bg-[#a855f7]/10 transition-colors"
            >
              ♿ Toggle Accessible
            </button>
            <button
              onClick={onDeleteSelectedSeats}
              className="py-2 rounded-lg text-xs font-semibold border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
            >
              🗑 Delete Selected
            </button>
          </div>

          <Field label="Change type">
            <select
              className={inputCls}
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  onChangeSelectedSeatsType(e.target.value as SeatType);
                  e.target.value = "";
                }
              }}
            >
              <option value="" disabled>
                Select new type…
              </option>
              {SEAT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}
    </div>
  );
}
