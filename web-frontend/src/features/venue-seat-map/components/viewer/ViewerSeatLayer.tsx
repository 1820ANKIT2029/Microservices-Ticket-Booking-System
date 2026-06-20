"use client";

import React from "react";
import { Layer, Group, Rect, Text, Circle } from "react-konva";
import type { LocalSection, LocalSeat } from "../../types";
import type { TicketTypeResponseDto } from "@/features/events/types";

interface ViewerSeatLayerProps {
  sections: LocalSection[];
  selectedSeatIds: number[];
  soldSeatIds: number[];
  ticketTypes: TicketTypeResponseDto[];
  onSeatSelect: (seatId: number) => void;
}

function getViewerSeatFill(seat: LocalSeat, isSelected: boolean, ticketType?: TicketTypeResponseDto): string {
  if (!seat.isActive) return "#9ca3af"; // Muted grey
  if (isSelected)     return "#3b82f6"; // Selected Blue
  if (seat.isAccessible) return "#a855f7"; // Accessible Purple

  if (ticketType) {
    const name = ticketType.name.toUpperCase();
    if (name.includes("VIP")) return "#f59e0b"; // Amber/Gold
    if (name.includes("PREMIUM") || name.includes("PLATINUM")) return "#ec4899"; // Pink
    if (name.includes("EARLY") || name.includes("GOLD")) return "#10b981"; // Emerald
    if (name.includes("GENERAL") || name.includes("STANDARD")) return "#22c55e"; // Green
  }

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
  isSold: boolean;
  ticketType?: TicketTypeResponseDto;
  onClick: () => void;
}

function ViewerSeat({ seat, isSelected, isSold, ticketType, onClick }: ViewerSeatProps) {
  const fill = isSold ? "#cbd5e1" : getViewerSeatFill(seat, isSelected, ticketType);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInteract = (e: any) => {
    e?.evt?.stopPropagation?.();
    if (isSold) return;
    onClick();
  };

  const handleMouseEnter = (e: any) => {
    const stage = e.target.getStage();
    if (stage) {
      stage.container().style.cursor = isSold ? "not-allowed" : "pointer";
    }
  };

  const handleMouseLeave = (e: any) => {
    const stage = e.target.getStage();
    if (stage) {
      stage.container().style.cursor = "grab";
    }
  };

  const props = {
    fill,
    stroke: isSelected ? "#1d4ed8" : (isSold ? "#94a3b8" : "rgba(0,0,0,0.15)"),
    strokeWidth: isSelected ? 2 : 1,
    onClick: handleInteract,
    onTap: handleInteract,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    shadowColor: isSelected ? "#3b82f6" : "transparent",
    shadowBlur:  isSelected ? 6 : 0,
    perfectDrawEnabled: false,
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
  STANDARD: "rgba(84,0,195,0.06)",
  PREMIUM:  "rgba(236,72,153,0.06)",
  VIP:      "rgba(245,158,11,0.06)",
  ECONOMY:  "rgba(100,116,139,0.06)",
  FLOOR:    "rgba(34,197,94,0.06)",
};

export const ViewerSeatLayer = React.memo(function ViewerSeatLayer({
  sections,
  selectedSeatIds,
  soldSeatIds,
  ticketTypes,
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
            fill={SECTION_TYPE_COLORS[section.sectionType] ?? "rgba(84,0,195,0.06)"}
            stroke="rgba(84,0,195,0.2)"
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
            .map((seat) => {
              const isSold = soldSeatIds.includes(seat.id);
              const isSelected = selectedSeatIds.includes(seat.id);
              const seatTicketType = ticketTypes.find((t) => t.venueSectionIds?.includes(section.id));

              return (
                <ViewerSeat
                  key={seat.id}
                  seat={seat}
                  isSelected={isSelected}
                  isSold={isSold}
                  ticketType={seatTicketType}
                  onClick={() => onSeatSelect(seat.id)}
                />
              );
            })}
        </Group>
      ))}
    </Layer>
  );
});
