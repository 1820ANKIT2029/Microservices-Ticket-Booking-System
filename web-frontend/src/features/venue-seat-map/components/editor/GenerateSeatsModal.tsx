"use client";

import React, { useState } from "react";
import type { SeatGenerationConfig, SeatShape, SeatType } from "../../types";

interface GenerateSeatsModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (config: SeatGenerationConfig) => void;
}

const SEAT_TYPES: SeatType[] = ["STANDARD", "PREMIUM", "VIP", "ECONOMY"];

const defaultConfig: SeatGenerationConfig = {
  rows: 5,
  seatsPerRow: 10,
  horizontalGap: 6,
  verticalGap: 6,
  seatWidth: 24,
  seatHeight: 24,
  seatShape: "circle",
  startRowLabel: "A",
  seatType: "STANDARD",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

export function GenerateSeatsModal({ open, onClose, onGenerate }: GenerateSeatsModalProps) {
  const [cfg, setCfg] = useState<SeatGenerationConfig>(defaultConfig);

  if (!open) return null;

  const set = <K extends keyof SeatGenerationConfig>(key: K, val: SeatGenerationConfig[K]) =>
    setCfg((prev) => ({ ...prev, [key]: val }));

  const handleGenerate = () => {
    onGenerate(cfg);
    onClose();
  };

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          <div>
            <h2 className="text-base font-bold text-foreground">Generate Seats</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Auto-fill seats inside the selected section
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Grid layout */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Rows">
              <input
                type="number"
                min={1}
                max={50}
                className={inputCls}
                value={cfg.rows}
                onChange={(e) => set("rows", Number(e.target.value))}
              />
            </Field>
            <Field label="Seats per row">
              <input
                type="number"
                min={1}
                max={100}
                className={inputCls}
                value={cfg.seatsPerRow}
                onChange={(e) => set("seatsPerRow", Number(e.target.value))}
              />
            </Field>
            <Field label="Horizontal gap (px)">
              <input
                type="number"
                min={0}
                className={inputCls}
                value={cfg.horizontalGap}
                onChange={(e) => set("horizontalGap", Number(e.target.value))}
              />
            </Field>
            <Field label="Vertical gap (px)">
              <input
                type="number"
                min={0}
                className={inputCls}
                value={cfg.verticalGap}
                onChange={(e) => set("verticalGap", Number(e.target.value))}
              />
            </Field>
            <Field label="Seat width (px)">
              <input
                type="number"
                min={8}
                max={80}
                className={inputCls}
                value={cfg.seatWidth}
                onChange={(e) => set("seatWidth", Number(e.target.value))}
              />
            </Field>
            <Field label="Seat height (px)">
              <input
                type="number"
                min={8}
                max={80}
                className={inputCls}
                value={cfg.seatHeight}
                onChange={(e) => set("seatHeight", Number(e.target.value))}
              />
            </Field>
            <Field label="Start row label">
              <input
                type="text"
                maxLength={1}
                className={inputCls}
                value={cfg.startRowLabel}
                onChange={(e) =>
                  set("startRowLabel", e.target.value.toUpperCase() || "A")
                }
              />
            </Field>
            <Field label="Seat type">
              <select
                className={inputCls}
                value={cfg.seatType}
                onChange={(e) => set("seatType", e.target.value as SeatType)}
              >
                {SEAT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Shape toggle */}
          <Field label="Seat shape">
            <div className="flex gap-2">
              {(["circle", "rectangle"] as SeatShape[]).map((s) => (
                <button
                  key={s}
                  onClick={() => set("seatShape", s)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                    cfg.seatShape === s
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-white border-border text-foreground hover:bg-accent"
                  }`}
                >
                  {s === "circle" ? "⬤ Circle" : "▬ Rectangle"}
                </button>
              ))}
            </div>
          </Field>

          {/* Preview info */}
          <div className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Preview: </span>
            {cfg.rows} rows × {cfg.seatsPerRow} seats ={" "}
            <span className="font-bold text-primary">{cfg.rows * cfg.seatsPerRow} seats</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/30">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            Generate Seats
          </button>
        </div>
      </div>
    </div>
  );
}
