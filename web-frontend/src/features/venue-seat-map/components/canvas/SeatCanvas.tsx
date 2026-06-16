"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";
import Konva from "konva";
import { SectionLayer } from "./SectionLayer";
import type { VenueEditorAPI } from "../../hooks/useVenueEditor";

interface SeatCanvasProps {
  editor: VenueEditorAPI;
  readOnly?: boolean;
}

const MIN_SCALE = 0.05;
const MAX_SCALE = 4;
const SCALE_BY  = 1.08;

export function SeatCanvas({ editor, readOnly = false }: SeatCanvasProps) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const stageRef      = useRef<Konva.Stage>(null);
  const [size, setSize]   = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const [pos,   setPos]   = useState({ x: 0, y: 0 });

  // Observe container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ width: el.clientWidth, height: el.clientHeight });
    });
    ro.observe(el);
    setSize({ width: el.clientWidth, height: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // ── Zoom ──────────────────────────────────────────────────────────────────

  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer  = stage.getPointerPosition()!;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY < 0 ? 1 : -1;
    const newScale  = Math.min(MAX_SCALE, Math.max(MIN_SCALE, oldScale * (direction > 0 ? SCALE_BY : 1 / SCALE_BY)));

    setScale(newScale);
    setPos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  }, []);

  // ── Fit to screen ─────────────────────────────────────────────────────────

  const fitToScreen = useCallback(() => {
    const { mapWidth, mapHeight } = editor.venue;
    const padding = 40;
    const scaleX = (size.width  - padding * 2) / mapWidth;
    const scaleY = (size.height - padding * 2) / mapHeight;
    const newScale = Math.min(scaleX, scaleY, 1);
    setScale(newScale);
    setPos({
      x: (size.width  - mapWidth  * newScale) / 2,
      y: (size.height - mapHeight * newScale) / 2,
    });
  }, [editor.venue, size]);

  // Auto-fit on first load
  useEffect(() => { fitToScreen(); }, [fitToScreen]);

  // ── Stage click — deselect ────────────────────────────────────────────────

  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === stageRef.current || e.target.name() === "map-bg") {
      editor.selectSection(null);
      editor.deselectAllSeats();
    }
  }, [editor]);

  const handleStageTap = useCallback((e: Konva.KonvaEventObject<TouchEvent>) => {
    if (e.target === stageRef.current || e.target.name() === "map-bg") {
      editor.selectSection(null);
      editor.deselectAllSeats();
    }
  }, [editor]);

  // ── Section CRUD callbacks ────────────────────────────────────────────────

  const handleDragSectionEnd = useCallback(
    (id: number, x: number, y: number) => editor.updateSection(id, { x, y }),
    [editor]
  );

  const handleTransformSectionEnd = useCallback(
    (id: number, x: number, y: number, width: number, height: number, rotation: number) => {
      editor.updateSection(id, { x, y, width, height, rotation });
    },
    [editor]
  );

  const handleDragSeatEnd = useCallback(
    (sectionId: number, seatId: number, x: number, y: number) => {
      editor.updateSeat(sectionId, seatId, { x, y });
    },
    [editor]
  );

  return (
    <div className="relative flex-1 flex flex-col h-full" ref={containerRef}>
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
          { color: "#6b7280", label: "Disabled" },
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
        draggable={!readOnly}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onTap={handleStageTap}
        style={{ background: "#f3ebfc", cursor: readOnly ? "default" : "grab" }}
      >
        {/* Map boundary background */}
        <Layer>
          <Rect
            name="map-bg"
            x={0}
            y={0}
            width={editor.venue.mapWidth}
            height={editor.venue.mapHeight}
            fill="#ffffff"
            stroke="#ccc3da"
            strokeWidth={2}
            shadowColor="#5400c3"
            shadowBlur={20}
            shadowOpacity={0.08}
            cornerRadius={8}
            perfectDrawEnabled={false}
          />
        </Layer>

        {/* Sections + seats */}
        <SectionLayer
          sections={editor.venue.sections}
          selectedSectionId={readOnly ? null : editor.selectedSectionId}
          selectedSeatIds={editor.selectedSeatIds}
          onSelectSection={editor.selectSection}
          onDragSectionEnd={handleDragSectionEnd}
          onTransformSectionEnd={handleTransformSectionEnd}
          onSelectSeat={editor.selectSeat}
          onDragSeatEnd={handleDragSeatEnd}
        />
      </Stage>
    </div>
  );
}
