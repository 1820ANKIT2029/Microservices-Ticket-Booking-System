"use client";

import { useCallback, useRef } from "react";
import { useSeatMapStore } from "../store/seat-map.store";

export function useVenueEditor() {
  const store = useSeatMapStore();
  const isCtrlHeld = useRef(false);

  // Keyboard multi-select tracking
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Control" || e.key === "Meta") isCtrlHeld.current = true;
    
    // Undo shortcut: Ctrl+Z
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
      e.preventDefault();
      store.undo();
    }
    // Redo shortcut: Ctrl+Y or Ctrl+Shift+Z
    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) {
      e.preventDefault();
      store.redo();
    }
  }, [store]);

  const onKeyUp = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Control" || e.key === "Meta") isCtrlHeld.current = false;
  }, []);

  // Selection delegate
  const selectSeat = useCallback(
    (seatId: number, multi?: boolean) => {
      store.selectSeat(seatId, multi ?? isCtrlHeld.current);
    },
    [store]
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
    loadVenue: store.loadVenue,
    setVenueField: store.setVenueField,
    addSection: store.addSection,
    updateSection: store.updateSection,
    deleteSection: store.deleteSection,
    selectSection: store.selectSection,
    generateSeats: store.generateSeats,
    updateSeat: store.updateSeat,
    deleteSeat: store.deleteSeat,
    deleteSelectedSeats: store.deleteSelectedSeats,
    selectSeat,
    deselectAllSeats: store.deselectAllSeats,
    changeSelectedSeatsType: store.changeSelectedSeatsType,
    toggleSelectedSeatsAccessible: store.toggleSelectedSeatsAccessible,
    openGenerateModal: store.openGenerateModal,
    closeGenerateModal: store.closeGenerateModal,
    clearDeletedIds: store.clearDeletedIds,
    undo: store.undo,
    redo: store.redo,

    // Keyboard helpers
    onKeyDown,
    onKeyUp,
  };
}

export type VenueEditorAPI = ReturnType<typeof useVenueEditor>;
