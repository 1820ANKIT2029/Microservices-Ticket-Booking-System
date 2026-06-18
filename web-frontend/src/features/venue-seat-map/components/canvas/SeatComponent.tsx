"use client";

import React from "react";
import { Circle, Rect, Group, Text } from "react-konva";
import Konva from "konva";
import type { LocalSeat } from "../../types";

interface SeatComponentProps {
  seat: LocalSeat;
  isSelected: boolean;
  sectionWidth?: number;
  sectionHeight?: number;
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
  sectionWidth,
  sectionHeight,
  onSelect,
  onDragEnd,
  draggable = true,
}: SeatComponentProps) {
  const fill = getSeatFill(seat, isSelected);
  const strokeColor = isSelected ? "#1d4ed8" : "rgba(0,0,0,0.2)";

  // Generic handler works for both onClick (MouseEvent) and onTap (TouchEvent)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (e: any) => {
    e.cancelBubble = true;
    if (e.evt?.stopPropagation) e.evt.stopPropagation();
    const isMulti = e.evt?.ctrlKey || e.evt?.metaKey || false;
    onSelect(seat.id, isMulti);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragStart = (e: any) => {
    e.cancelBubble = true;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragMove = (e: any) => {
    e.cancelBubble = true;
  };

  const handleDragEnd = (e: { target: { x: () => number; y: () => number }; cancelBubble: boolean }) => {
    e.cancelBubble = true;
    onDragEnd(seat.id, e.target.x(), e.target.y());
  };

  const commonShapeProps = {
    fill,
    stroke: strokeColor,
    strokeWidth: isSelected ? 2 : 1,
    shadowColor: isSelected ? "#3b82f6" : "transparent",
    shadowBlur: isSelected ? 6 : 0,
    perfectDrawEnabled: false,
  };

  const labelFontSize = Math.max(6, Math.min(seat.width * 0.35, 10));

  return (
    <Group
      x={seat.x}
      y={seat.y}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onTap={handleClick}
      dragBoundFunc={function (this: Konva.Node, pos) {
        const parent = this.getParent();
        if (!parent || sectionWidth === undefined || sectionHeight === undefined) return pos;
        
        // Convert the absolute pointer position into local section coordinates
        const transform = parent.getAbsoluteTransform().copy().invert();
        const localPos = transform.point(pos);
        
        // Clamp local coordinates so the seat shape doesn't spill over the section edges.
        // Shape is centered at (0,0) in the group, so bounds inset by half width/height.
        const minX = seat.width / 2;
        const maxX = Math.max(minX, sectionWidth - seat.width / 2);
        const minY = seat.height / 2;
        const maxY = Math.max(minY, sectionHeight - seat.height / 2);
        
        const clampedX = Math.max(minX, Math.min(maxX, localPos.x));
        const clampedY = Math.max(minY, Math.min(maxY, localPos.y));
        
        // Convert the clamped local coordinates back to absolute coordinates for Konva
        return parent.getAbsoluteTransform().point({ x: clampedX, y: clampedY });
      }}
    >
      {seat.shape === "circle" ? (
        <Circle
          {...commonShapeProps}
          radius={seat.width / 2}
          x={0}
          y={0}
        />
      ) : (
        <Rect
          {...commonShapeProps}
          width={seat.width}
          height={seat.height}
          x={-seat.width / 2}
          y={-seat.height / 2}
          cornerRadius={3}
        />
      )}
      {/* Row + seat label — only shown at reasonable zoom */}
      <Text
        x={-seat.width / 2}
        y={-labelFontSize / 2}
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
