"use client";

import { useCallback, useRef } from "react";
import { useSeatMapStore, seatMapStore } from "../store/seat-map.store";

export function useVenueEditor() {
  const store = useSeatMapStore();
  const isCtrlHeld = useRef(false);

  // Keyboard multi-select tracking
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Control" || e.key === "Meta") isCtrlHeld.current = true;
    
    // Undo shortcut: Ctrl+Z
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
      e.preventDefault();
      seatMapStore.undo();
    }
    // Redo shortcut: Ctrl+Y or Ctrl+Shift+Z
    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) {
      e.preventDefault();
      seatMapStore.redo();
    }
  }, []);

  const onKeyUp = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Control" || e.key === "Meta") isCtrlHeld.current = false;
  }, []);

  // Selection delegate
  const selectSeat = useCallback(
    (seatId: number, multi?: boolean) => {
      seatMapStore.selectSeat(seatId, multi ?? isCtrlHeld.current);
    },
    []
  );

  // Convenience computed selections
  const selectedSection =
    store.venue.sections.find((s) => s.id === store.selectedSectionId) ?? null;

  const selectedSeats = selectedSection
    ? selectedSection.seats.filter((s) => store.selectedSeatIds.includes(s.id))
    : [];

  return {
    // State
    venue: store.venue,
    selectedSectionId: store.selectedSectionId,
    selectedSeatIds: store.selectedSeatIds,
    selectedSection,
    selectedSeats,
    isGenerateModalOpen: store.isGenerateModalOpen,
    isSaving: store.isSaving,
    deletedSectionIds: store.deletedSectionIds,
    deletedSeatIds: store.deletedSeatIds,
    savedSnapshot: store.savedSnapshot,
    past: store.past,
    future: store.future,

    // Actions
    // Actions
    loadVenue: seatMapStore.loadVenue,
    setVenueField: seatMapStore.setVenueField,
    addSection: seatMapStore.addSection,
    updateSection: seatMapStore.updateSection,
    deleteSection: seatMapStore.deleteSection,
    selectSection: seatMapStore.selectSection,
    generateSeats: seatMapStore.generateSeats,
    updateSeat: seatMapStore.updateSeat,
    deleteSeat: seatMapStore.deleteSeat,
    deleteSelectedSeats: seatMapStore.deleteSelectedSeats,
    selectSeat,
    deselectAllSeats: seatMapStore.deselectAllSeats,
    changeSelectedSeatsType: seatMapStore.changeSelectedSeatsType,
    toggleSelectedSeatsAccessible: seatMapStore.toggleSelectedSeatsAccessible,
    openGenerateModal: seatMapStore.openGenerateModal,
    closeGenerateModal: seatMapStore.closeGenerateModal,
    clearDeletedIds: seatMapStore.clearDeletedIds,
    undo: seatMapStore.undo,
    redo: seatMapStore.redo,

    // Keyboard helpers
    onKeyDown,
    onKeyUp,
  };
}

export type VenueEditorAPI = ReturnType<typeof useVenueEditor>;
