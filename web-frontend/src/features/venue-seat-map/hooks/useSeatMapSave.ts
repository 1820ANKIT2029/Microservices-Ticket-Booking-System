import { useCallback } from "react";
import { VenueSeatMapService } from "@/features/venue-seat-map/api/service";
import type { LocalVenue } from "../types";
import { parseSection } from "../utils/parsers";

export function useSeatMapSave(editor: any, showToast: (type: "success" | "error", msg: string) => void) {
  const handleSave = useCallback(async () => {
    const vid = editor.venue.id ?? 0;

    try {
      const { deletedSectionIds, deletedSeatIds } = editor;

      if (deletedSectionIds.length > 0 || deletedSeatIds.length > 0) {
        await Promise.all([
          ...deletedSectionIds.map((sId: number) =>
            VenueSeatMapService.deleteSection(vid, sId)
          ),
          ...deletedSeatIds.map(({ sectionId, seatId }: any) =>
            VenueSeatMapService.deleteSeat(vid, sectionId, seatId)
          ),
        ]);
      }

      const isVenueDirty = 
        editor.venue.name !== editor.savedSnapshot?.name ||
        editor.venue.mapWidth !== editor.savedSnapshot?.mapWidth ||
        editor.venue.mapHeight !== editor.savedSnapshot?.mapHeight;

      if (isVenueDirty) {
        await VenueSeatMapService.updateVenueMetadata(vid, editor.venue.name, editor.venue.mapWidth, editor.venue.mapHeight);
      }

      await Promise.all(
        editor.venue.sections.map(async (section: any) => {
          const sectionPayload = {
            venueId:     vid,
            name:        section.name,
            sectionType: section.sectionType,
            totalSeats:  section.seats.length,
            x:           section.x,
            y:           section.y,
            width:       section.width,
            height:      section.height,
            rotation:    section.rotation,
          };

          let realSectionId: number;

          if (section.id < 0) {
            const created = await VenueSeatMapService.createSection(sectionPayload);
            realSectionId = created.id;
          } else {
            realSectionId = section.id;
            
            const originalSection = editor.savedSnapshot?.sections.find((s: any) => s.id === section.id);
            const isDirty = !originalSection || 
              section.name !== originalSection.name ||
              section.sectionType !== originalSection.sectionType ||
              section.seats.length !== originalSection.seats.length ||
              section.x !== originalSection.x ||
              section.y !== originalSection.y ||
              section.width !== originalSection.width ||
              section.height !== originalSection.height ||
              section.rotation !== originalSection.rotation;

            if (isDirty) {
              await VenueSeatMapService.updateSection(vid, section.id, {
                ...sectionPayload,
                id: section.id,
              });
            }
          }

          const newSeats  = section.seats.filter((s: any) => s.id < 0);
          const existingSeats = section.seats.filter((s: any) => s.id > 0);

          await Promise.all([
            newSeats.length > 0
              ? VenueSeatMapService.createSeatsBatch(
                  vid,
                  realSectionId,
                  newSeats.map((seat: any) => ({
                    venueId:        vid,
                    venueSectionId: realSectionId,
                    rowLabel:       seat.rowLabel,
                    seatNumber:     seat.seatNumber,
                    seatType:       seat.seatType,
                    x:              seat.x,
                    y:              seat.y,
                    width:          seat.width,
                    height:         seat.height,
                    rotation:       seat.rotation,
                    shape:          seat.shape,
                    isAccessible:   seat.isAccessible,
                    isActive:       seat.isActive,
                  }))
                )
              : Promise.resolve(null),

            ...existingSeats.map((seat: any) => {
              const originalSection = editor.savedSnapshot?.sections.find((s: any) => s.id === section.id);
              const originalSeat = originalSection?.seats.find((s: any) => s.id === seat.id);
              
              const isDirty = !originalSeat || 
                seat.rowLabel !== originalSeat.rowLabel ||
                seat.seatNumber !== originalSeat.seatNumber ||
                seat.seatType !== originalSeat.seatType ||
                seat.x !== originalSeat.x ||
                seat.y !== originalSeat.y ||
                seat.width !== originalSeat.width ||
                seat.height !== originalSeat.height ||
                seat.rotation !== originalSeat.rotation ||
                seat.shape !== originalSeat.shape ||
                seat.isAccessible !== originalSeat.isAccessible ||
                seat.isActive !== originalSeat.isActive;

              if (!isDirty) return Promise.resolve(null);

              return VenueSeatMapService.updateSeat(vid, realSectionId, seat.id, {
                id:             seat.id,
                venueId:        vid,
                venueSectionId: realSectionId,
                rowLabel:       seat.rowLabel,
                seatNumber:     seat.seatNumber,
                seatType:       seat.seatType,
                x:              seat.x,
                y:              seat.y,
                width:          seat.width,
                height:         seat.height,
                rotation:       seat.rotation,
                shape:          seat.shape,
                isAccessible:   seat.isAccessible,
                isActive:       seat.isActive,
              });
            }),
          ]);
        })
      );

      showToast("success", "Layout saved!");

      try {
        const [venueDto, sections] = await Promise.all([
          VenueSeatMapService.getVenue(vid),
          VenueSeatMapService.getSections(vid).catch(() => []),
        ]);

        const reloaded: LocalVenue = {
          id:        venueDto.id,
          name:      venueDto.name,
          mapWidth:  venueDto.mapWidth  ?? editor.venue.mapWidth,
          mapHeight: venueDto.mapHeight ?? editor.venue.mapHeight,
          sections:  (Array.isArray(sections) ? sections : []).map(parseSection),
        };

        editor.loadVenue(reloaded);
      } catch {
        editor.clearDeletedIds();
      }
    } catch {
      showToast("error", "Save failed. Check the console for details.");
    }
  }, [editor, showToast]);

  return { handleSave };
}
