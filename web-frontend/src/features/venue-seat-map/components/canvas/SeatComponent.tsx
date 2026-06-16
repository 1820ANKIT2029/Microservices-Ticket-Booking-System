"use client";

import React from "react";
import { Circle, Rect, Group, Text } from "react-konva";
import type { LocalSeat } from "../../types";

interface SeatComponentProps {
  seat: LocalSeat;
  isSelected: boolean;
  onSelect: (seatId: number, multi: boolean) => void;
  onDragEnd: (seatId: number, x: number, y: number) => void;
  draggable?: boolean;
}

function getSeatFill(seat: LocalSeat, isSelected: boolean): string {
  if (isSelected) return "#3b82f6";           // blue
  if (!seat.isActive) return "#6b7280";        // gray
  if (seat.isAccessible) return "#a855f7";     // purple
  switch (seat.seatType) {
    case "VIP":     return "#f59e0b";
    case "PREMIUM": return "#ec4899";
    case "ECONOMY": return "#64748b";
    default:        return "#22c55e";           // green (STANDARD / available)
  }
}

export const SeatComponent = React.memo(function SeatComponent({
  seat,
  isSelected,
  onSelect,
  onDragEnd,
  draggable = true,
}: SeatComponentProps) {
  const fill = getSeatFill(seat, isSelected);
  const strokeColor = isSelected ? "#1d4ed8" : "rgba(0,0,0,0.2)";

  // Generic handler works for both onClick (MouseEvent) and onTap (TouchEvent)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (e: any) => {
    if (e.evt?.stopPropagation) e.evt.stopPropagation();
    const isMulti = e.evt?.ctrlKey || e.evt?.metaKey || false;
    onSelect(seat.id, isMulti);
  };

  const handleDragEnd = (e: { target: { x: () => number; y: () => number } }) => {
    onDragEnd(seat.id, e.target.x(), e.target.y());
  };

  const commonProps = {
    x: seat.x,
    y: seat.y,
    fill,
    stroke: strokeColor,
    strokeWidth: isSelected ? 2 : 1,
    draggable,
    onClick: handleClick,
    onTap: handleClick,
    onDragEnd: handleDragEnd,
    shadowColor: isSelected ? "#3b82f6" : "transparent",
    shadowBlur: isSelected ? 6 : 0,
    perfectDrawEnabled: false,
  };

  const labelFontSize = Math.max(6, Math.min(seat.width * 0.35, 10));

  return (
    <Group>
      {seat.shape === "circle" ? (
        <Circle
          {...commonProps}
          radius={seat.width / 2}
          offsetX={0}
          offsetY={0}
        />
      ) : (
        <Rect
          {...commonProps}
          width={seat.width}
          height={seat.height}
          offsetX={seat.width / 2}
          offsetY={seat.height / 2}
          cornerRadius={3}
        />
      )}
      {/* Row + seat label — only shown at reasonable zoom */}
      <Text
        x={seat.x - seat.width / 2}
        y={seat.y - labelFontSize / 2}
        width={seat.width}
        height={labelFontSize}
        text={`${seat.rowLabel}${seat.seatNumber}`}
        fontSize={labelFontSize}
        fill="white"
        align="center"
        verticalAlign="middle"
        listening={false}
        perfectDrawEnabled={false}
      />
    </Group>
  );
});
