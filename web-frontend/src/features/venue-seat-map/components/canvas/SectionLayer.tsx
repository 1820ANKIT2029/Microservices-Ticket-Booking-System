"use client";

import React, { useRef, useEffect } from "react";
import { Layer, Group, Rect, Text, Transformer } from "react-konva";
import Konva from "konva";
import { SeatComponent } from "./SeatComponent";
import type { LocalSection } from "../../types";

interface SectionLayerProps {
  sections: LocalSection[];
  selectedSectionId: number | null;
  selectedSeatIds: number[];
  onSelectSection: (id: number) => void;
  onDragSectionEnd: (id: number, x: number, y: number) => void;
  onTransformSectionEnd: (id: number, x: number, y: number, width: number, height: number, rotation: number) => void;
  onSelectSeat: (seatId: number, multi: boolean) => void;
  onDragSeatEnd: (sectionId: number, seatId: number, x: number, y: number) => void;
}

interface SectionGroupProps {
  section: LocalSection;
  isSelected: boolean;
  selectedSeatIds: number[];
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (x: number, y: number, w: number, h: number, rot: number) => void;
  onSelectSeat: (seatId: number, multi: boolean) => void;
  onDragSeatEnd: (sectionId: number, seatId: number, x: number, y: number) => void;
}

// Color palette per section type
const SECTION_TYPE_COLORS: Record<string, string> = {
  STANDARD: "rgba(84,0,195,0.12)",
  PREMIUM:  "rgba(236,72,153,0.12)",
  VIP:      "rgba(245,158,11,0.12)",
  ECONOMY:  "rgba(100,116,139,0.12)",
  FLOOR:    "rgba(34,197,94,0.12)",
};

function SectionGroup({
  section,
  isSelected,
  selectedSeatIds,
  onSelect,
  onDragEnd,
  onTransformEnd,
  onSelectSeat,
  onDragSeatEnd,
}: SectionGroupProps) {
  const groupRef = useRef<Konva.Group>(null);
  const trRef    = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const sectionFill = SECTION_TYPE_COLORS[section.sectionType] ?? "rgba(84,0,195,0.12)";
  const strokeColor = isSelected ? "#5400c3" : "rgba(84,0,195,0.4)";

  return (
    <>
      <Group
        ref={groupRef}
        x={section.x}
        y={section.y}
        rotation={section.rotation}
        draggable
        onClick={(e) => { e.cancelBubble = true; onSelect(); }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onTap={(e: any) => { e.cancelBubble = true; onSelect(); }}
        onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
        onTransformEnd={() => {
          const node = groupRef.current!;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onTransformEnd(
            node.x(),
            node.y(),
            Math.max(60, section.width * scaleX),
            Math.max(40, section.height * scaleY),
            node.rotation()
          );
        }}
      >
        {/* Section background */}
        <Rect
          width={section.width}
          height={section.height}
          fill={sectionFill}
          stroke={strokeColor}
          strokeWidth={isSelected ? 2 : 1.5}
          cornerRadius={6}
          shadowColor={isSelected ? "#5400c3" : "transparent"}
          shadowBlur={isSelected ? 12 : 0}
          shadowOpacity={0.25}
          perfectDrawEnabled={false}
        />

        {/* Section label */}
        <Text
          x={6}
          y={6}
          text={`${section.name} (${section.sectionType})`}
          fontSize={12}
          fontStyle="bold"
          fill={isSelected ? "#5400c3" : "#4a4457"}
          listening={false}
          perfectDrawEnabled={false}
        />

        {/* Seats rendered inside the group so they inherit transform */}
        {section.seats.map((seat) => (
          <SeatComponent
            key={seat.id}
            seat={seat}
            isSelected={selectedSeatIds.includes(seat.id)}
            onSelect={onSelectSeat}
            onDragEnd={(seatId, x, y) => onDragSeatEnd(section.id, seatId, x, y)}
            draggable
          />
        ))}
      </Group>

      {/* Konva Transformer — only mounted when section is selected */}
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled
          keepRatio={false}
          boundBoxFunc={(_, newBox) => ({
            ...newBox,
            width: Math.max(60, newBox.width),
            height: Math.max(40, newBox.height),
          })}
        />
      )}
    </>
  );
}

export const SectionLayer = React.memo(function SectionLayer({
  sections,
  selectedSectionId,
  selectedSeatIds,
  onSelectSection,
  onDragSectionEnd,
  onTransformSectionEnd,
  onSelectSeat,
  onDragSeatEnd,
}: SectionLayerProps) {
  return (
    <Layer>
      {sections.map((section) => (
        <SectionGroup
          key={section.id}
          section={section}
          isSelected={section.id === selectedSectionId}
          selectedSeatIds={selectedSeatIds}
          onSelect={() => onSelectSection(section.id)}
          onDragEnd={(x, y) => onDragSectionEnd(section.id, x, y)}
          onTransformEnd={(x, y, w, h, rot) =>
            onTransformSectionEnd(section.id, x, y, w, h, rot)
          }
          onSelectSeat={onSelectSeat}
          onDragSeatEnd={onDragSeatEnd}
        />
      ))}
    </Layer>
  );
});
