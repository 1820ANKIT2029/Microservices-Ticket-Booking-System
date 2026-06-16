"use client";

import React from "react";
import { Layer, Group, Rect, Text, Circle } from "react-konva";
import type { LocalSection, LocalSeat } from "../../types";

interface ViewerSeatLayerProps {
  sections: LocalSection[];
  selectedSeatIds: number[];
  onSeatSelect: (seatId: number) => void;
}

function getViewerSeatFill(seat: LocalSeat, isSelected: boolean): string {
  if (!seat.isActive) return "#6b7280";
  if (isSelected)     return "#3b82f6";
  if (seat.isAccessible) return "#a855f7";
  switch (seat.seatType) {
    case "VIP":     return "#f59e0b";
    case "PREMIUM": return "#ec4899";
    case "ECONOMY": return "#64748b";
    default:        return "#22c55e";
  }
}

interface ViewerSeatProps {
  seat: LocalSeat;
  isSelected: boolean;
  onClick: () => void;
}

function ViewerSeat({ seat, isSelected, onClick }: ViewerSeatProps) {
  const fill = getViewerSeatFill(seat, isSelected);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInteract = (e: any) => { e?.evt?.stopPropagation?.(); onClick(); };

  const props = {
    fill,
    stroke: isSelected ? "#1d4ed8" : "rgba(0,0,0,0.15)",
    strokeWidth: isSelected ? 2 : 1,
    onClick: handleInteract,
    onTap: handleInteract,
    shadowColor: isSelected ? "#3b82f6" : "transparent",
    shadowBlur:  isSelected ? 6 : 0,
    perfectDrawEnabled: false,
    cursor: "pointer",
  };

  if (seat.shape === "circle") {
    return (
      <Circle
        x={seat.x}
        y={seat.y}
        radius={seat.width / 2}
        {...props}
      />
    );
  }
  return (
    <Rect
      x={seat.x}
      y={seat.y}
      width={seat.width}
      height={seat.height}
      offsetX={seat.width / 2}
      offsetY={seat.height / 2}
      cornerRadius={3}
      {...props}
    />
  );
}

const SECTION_TYPE_COLORS: Record<string, string> = {
  STANDARD: "rgba(84,0,195,0.08)",
  PREMIUM:  "rgba(236,72,153,0.08)",
  VIP:      "rgba(245,158,11,0.08)",
  ECONOMY:  "rgba(100,116,139,0.08)",
  FLOOR:    "rgba(34,197,94,0.08)",
};

export const ViewerSeatLayer = React.memo(function ViewerSeatLayer({
  sections,
  selectedSeatIds,
  onSeatSelect,
}: ViewerSeatLayerProps) {
  return (
    <Layer>
      {sections.map((section) => (
        <Group key={section.id} x={section.x} y={section.y} rotation={section.rotation}>
          {/* Section background (read-only, not draggable) */}
          <Rect
            width={section.width}
            height={section.height}
            fill={SECTION_TYPE_COLORS[section.sectionType] ?? "rgba(84,0,195,0.08)"}
            stroke="rgba(84,0,195,0.25)"
            strokeWidth={1}
            cornerRadius={6}
            listening={false}
            perfectDrawEnabled={false}
          />
          <Text
            x={6}
            y={6}
            text={section.name}
            fontSize={11}
            fontStyle="bold"
            fill="#4a4457"
            listening={false}
            perfectDrawEnabled={false}
          />
          {/* Seats */}
          {section.seats
            .filter((s) => s.isActive)
            .map((seat) => (
              <ViewerSeat
                key={seat.id}
                seat={seat}
                isSelected={selectedSeatIds.includes(seat.id)}
                onClick={() => onSeatSelect(seat.id)}
              />
            ))}
        </Group>
      ))}
    </Layer>
  );
});
