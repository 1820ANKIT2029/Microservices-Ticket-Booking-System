"use client";

import React from "react";
import { Layer } from "react-konva";
import { SeatComponent } from "./SeatComponent";
import type { LocalSeat } from "../../types";

interface SeatLayerProps {
  seats: LocalSeat[];
  selectedSeatIds: number[];
  sectionId: number;
  onSelectSeat: (seatId: number, multi: boolean) => void;
  onDragSeatEnd: (sectionId: number, seatId: number, x: number, y: number) => void;
  draggable?: boolean;
}

export const SeatLayer = React.memo(function SeatLayer({
  seats,
  selectedSeatIds,
  sectionId,
  onSelectSeat,
  onDragSeatEnd,
  draggable = true,
}: SeatLayerProps) {
  return (
    <Layer>
      {seats.map((seat) => (
        <SeatComponent
          key={seat.id}
          seat={seat}
          isSelected={selectedSeatIds.includes(seat.id)}
          onSelect={onSelectSeat}
          onDragEnd={(seatId, x, y) => onDragSeatEnd(sectionId, seatId, x, y)}
          draggable={draggable}
        />
      ))}
    </Layer>
  );
});
