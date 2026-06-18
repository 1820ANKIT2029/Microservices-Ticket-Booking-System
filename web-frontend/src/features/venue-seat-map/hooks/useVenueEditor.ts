"use client";

import { useCallback, useReducer, useRef } from "react";
import type {
  LocalVenue,
  LocalSection,
  LocalSeat,
  SeatGenerationConfig,
  SeatType,
  SeatShape,
} from "../types";

// ─── State shape ──────────────────────────────────────────────────────────────

interface EditorStateInternal {
  venue: LocalVenue;
  selectedSectionId: number | null;
  selectedSeatIds: number[];
  isGenerateModalOpen: boolean;
  isSaving: boolean;
  /** Real IDs (> 0) of sections deleted since last load/save — sent on next save */
  deletedSectionIds: number[];
  /**
   * Real IDs (> 0) of individual seats deleted from sections that still exist.
   * Seats in deleted sections are cascade-deleted by the server — not tracked here.
   */
  deletedSeatIds: Array<{ sectionId: number; seatId: number }>;
  /**
   * Frozen snapshot of the venue exactly as it was received from the server
   * (set on every LOAD_VENUE). Used to diff sections/seats before deciding
   * whether to issue a PUT request — no-ops are skipped entirely.
   */
  savedSnapshot: LocalVenue | null;
}

// ─── Action types ─────────────────────────────────────────────────────────────

type Action =
  | { type: "LOAD_VENUE"; payload: LocalVenue }
  | { type: "SET_VENUE_FIELD"; field: keyof Omit<LocalVenue, "sections">; value: string | number | null }
  | { type: "ADD_SECTION"; section: LocalSection }
  | { type: "UPDATE_SECTION"; id: number; changes: Partial<Omit<LocalSection, "id" | "seats">> }
  | { type: "DELETE_SECTION"; id: number }
  | { type: "SELECT_SECTION"; id: number | null }
  | { type: "GENERATE_SEATS"; sectionId: number; seats: LocalSeat[] }
  | { type: "UPDATE_SEAT"; sectionId: number; seatId: number; changes: Partial<LocalSeat> }
  | { type: "DELETE_SEAT"; sectionId: number; seatId: number }
  | { type: "DELETE_SELECTED_SEATS"; sectionId: number }
  | { type: "SELECT_SEAT"; seatId: number; multi: boolean }
  | { type: "DESELECT_ALL_SEATS" }
  | { type: "CHANGE_SELECTED_SEATS_TYPE"; sectionId: number; seatType: SeatType }
  | { type: "TOGGLE_SELECTED_SEATS_ACCESSIBLE"; sectionId: number }
  | { type: "OPEN_GENERATE_MODAL" }
  | { type: "CLOSE_GENERATE_MODAL" }
  | { type: "SET_SAVING"; value: boolean }
  | { type: "CLEAR_DELETED_IDS" };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: EditorStateInternal, action: Action): EditorStateInternal {
  switch (action.type) {
    case "LOAD_VENUE":
      return {
        ...state,
        venue: action.payload,
        // Snapshot is set to the exact payload object. Because all reducer
        // updates create new references (immutable pattern), this reference
        // will always point to the server-sourced venue — never the live edits.
        savedSnapshot: action.payload,
        selectedSectionId: null,
        selectedSeatIds: [],
        deletedSectionIds: [],
        deletedSeatIds: [],
      };

    case "SET_VENUE_FIELD":
      return { ...state, venue: { ...state.venue, [action.field]: action.value } };

    case "ADD_SECTION":
      return {
        ...state,
        venue: { ...state.venue, sections: [...state.venue.sections, action.section] },
        selectedSectionId: action.section.id,
        selectedSeatIds: [],
      };

    case "UPDATE_SECTION":
      return {
        ...state,
        venue: {
          ...state.venue,
          sections: state.venue.sections.map((s) =>
            s.id === action.id ? { ...s, ...action.changes } : s
          ),
        },
      };

    case "DELETE_SECTION": {
      // Track real IDs so the save handler can issue DELETE calls
      const wasAlreadySaved = action.id > 0;
      return {
        ...state,
        venue: {
          ...state.venue,
          sections: state.venue.sections.filter((s) => s.id !== action.id),
        },
        selectedSectionId: state.selectedSectionId === action.id ? null : state.selectedSectionId,
        selectedSeatIds: [],
        deletedSectionIds: wasAlreadySaved
          ? [...state.deletedSectionIds, action.id]
          : state.deletedSectionIds,
        // Seats in a deleted section are cascade-deleted server-side — remove any
        // individually tracked seat deletions that belong to this section to avoid
        // redundant DELETE calls.
        deletedSeatIds: state.deletedSeatIds.filter((d) => d.sectionId !== action.id),
      };
    }

    case "SELECT_SECTION":
      return { ...state, selectedSectionId: action.id, selectedSeatIds: [] };

    case "GENERATE_SEATS": {
      // When re-generating seats for an already-saved section, the old persisted
      // seats (id > 0) are dropped from local state but still exist on the server.
      // Record them for deletion so Phase 1 of handleSave can clean them up.
      const targetSection = state.venue.sections.find((s) => s.id === action.sectionId);
      const stalePersistedSeats = targetSection
        ? targetSection.seats
            .filter((s) => s.id > 0)
            .map((s) => ({ sectionId: action.sectionId, seatId: s.id }))
        : [];
      return {
        ...state,
        venue: {
          ...state.venue,
          sections: state.venue.sections.map((s) =>
            s.id === action.sectionId ? { ...s, seats: action.seats } : s
          ),
        },
        deletedSeatIds: [...state.deletedSeatIds, ...stalePersistedSeats],
      };
    }

    case "UPDATE_SEAT":
      return {
        ...state,
        venue: {
          ...state.venue,
          sections: state.venue.sections.map((s) =>
            s.id === action.sectionId
              ? {
                  ...s,
                  seats: s.seats.map((seat) =>
                    seat.id === action.seatId ? { ...seat, ...action.changes } : seat
                  ),
                }
              : s
          ),
        },
      };

    case "DELETE_SEAT": {
      const wasAlreadySaved = action.seatId > 0;
      return {
        ...state,
        venue: {
          ...state.venue,
          sections: state.venue.sections.map((s) =>
            s.id === action.sectionId
              ? { ...s, seats: s.seats.filter((seat) => seat.id !== action.seatId) }
              : s
          ),
        },
        selectedSeatIds: state.selectedSeatIds.filter((id) => id !== action.seatId),
        deletedSeatIds: wasAlreadySaved
          ? [...state.deletedSeatIds, { sectionId: action.sectionId, seatId: action.seatId }]
          : state.deletedSeatIds,
      };
    }

    case "DELETE_SELECTED_SEATS": {
      const section = state.venue.sections.find((s) => s.id === action.sectionId);
      const seatsToDelete = section
        ? section.seats.filter((s) => state.selectedSeatIds.includes(s.id))
        : [];
      const newDeletedSeatIds = [
        ...state.deletedSeatIds,
        ...seatsToDelete
          .filter((s) => s.id > 0)
          .map((s) => ({ sectionId: action.sectionId, seatId: s.id })),
      ];
      return {
        ...state,
        venue: {
          ...state.venue,
          sections: state.venue.sections.map((s) =>
            s.id === action.sectionId
              ? { ...s, seats: s.seats.filter((seat) => !state.selectedSeatIds.includes(seat.id)) }
              : s
          ),
        },
        selectedSeatIds: [],
        deletedSeatIds: newDeletedSeatIds,
      };
    }

    case "SELECT_SEAT":
      return {
        ...state,
        selectedSeatIds: action.multi
          ? state.selectedSeatIds.includes(action.seatId)
            ? state.selectedSeatIds.filter((id) => id !== action.seatId)
            : [...state.selectedSeatIds, action.seatId]
          : state.selectedSeatIds.includes(action.seatId) && state.selectedSeatIds.length === 1
          ? []
          : [action.seatId],
      };

    case "DESELECT_ALL_SEATS":
      return { ...state, selectedSeatIds: [] };

    case "CHANGE_SELECTED_SEATS_TYPE":
      return {
        ...state,
        venue: {
          ...state.venue,
          sections: state.venue.sections.map((s) =>
            s.id === action.sectionId
              ? {
                  ...s,
                  seats: s.seats.map((seat) =>
                    state.selectedSeatIds.includes(seat.id)
                      ? { ...seat, seatType: action.seatType }
                      : seat
                  ),
                }
              : s
          ),
        },
      };

    case "TOGGLE_SELECTED_SEATS_ACCESSIBLE":
      return {
        ...state,
        venue: {
          ...state.venue,
          sections: state.venue.sections.map((s) =>
            s.id === action.sectionId
              ? {
                  ...s,
                  seats: s.seats.map((seat) =>
                    state.selectedSeatIds.includes(seat.id)
                      ? { ...seat, isAccessible: !seat.isAccessible }
                      : seat
                  ),
                }
              : s
          ),
        },
      };

    case "OPEN_GENERATE_MODAL":
      return { ...state, isGenerateModalOpen: true };

    case "CLOSE_GENERATE_MODAL":
      return { ...state, isGenerateModalOpen: false };

    case "SET_SAVING":
      return { ...state, isSaving: action.value };

    case "CLEAR_DELETED_IDS":
      return { ...state, deletedSectionIds: [], deletedSeatIds: [] };

    default:
      return state;
  }
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: EditorStateInternal = {
  venue: {
    id: null,
    name: "New Venue",
    mapWidth: 1200,
    mapHeight: 800,
    sections: [],
  },
  selectedSectionId: null,
  selectedSeatIds: [],
  isGenerateModalOpen: false,
  isSaving: false,
  deletedSectionIds: [],
  deletedSeatIds: [],
  savedSnapshot: null,
};

// ─── Temp ID counter ──────────────────────────────────────────────────────────

let _tempId = -1;
function nextTempId() {
  return _tempId--;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useVenueEditor() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isCtrlHeld = useRef(false);

  // Keyboard multi-select tracking (call these in onKeyDown/Up of the canvas container)
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Control" || e.key === "Meta") isCtrlHeld.current = true;
  }, []);

  const onKeyUp = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Control" || e.key === "Meta") isCtrlHeld.current = false;
  }, []);

  // ── Venue ──────────────────────────────────────────────────────────────────

  const loadVenue = useCallback((venue: LocalVenue) => {
    dispatch({ type: "LOAD_VENUE", payload: venue });
  }, []);

  const setVenueField = useCallback(
    (field: keyof Omit<LocalVenue, "sections">, value: string | number | null) => {
      dispatch({ type: "SET_VENUE_FIELD", field, value });
    },
    []
  );

  // ── Sections ───────────────────────────────────────────────────────────────

  const addSection = useCallback(() => {
    const section: LocalSection = {
      id: nextTempId(),
      venueId: state.venue.id ?? 0,
      name: `Section ${state.venue.sections.length + 1}`,
      sectionType: "STANDARD",
      x: 100,
      y: 100,
      width: 300,
      height: 200,
      rotation: 0,
      seats: [],
    };
    dispatch({ type: "ADD_SECTION", section });
  }, [state.venue.id, state.venue.sections.length]);

  const updateSection = useCallback(
    (id: number, changes: Partial<Omit<LocalSection, "id" | "seats">>) => {
      dispatch({ type: "UPDATE_SECTION", id, changes });
    },
    []
  );

  const deleteSection = useCallback((id: number) => {
    dispatch({ type: "DELETE_SECTION", id });
  }, []);

  const selectSection = useCallback((id: number | null) => {
    dispatch({ type: "SELECT_SECTION", id });
  }, []);

  // ── Seat Generation ────────────────────────────────────────────────────────

  const generateSeats = useCallback(
    (sectionId: number, config: SeatGenerationConfig) => {
      const section = state.venue.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const seats: LocalSeat[] = [];
      const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const startIdx = rowLabels.indexOf(config.startRowLabel.toUpperCase());

      for (let r = 0; r < config.rows; r++) {
        const rowLabel = rowLabels[(startIdx + r) % rowLabels.length];
        for (let c = 0; c < config.seatsPerRow; c++) {
          seats.push({
            id: nextTempId(),
            venueId: section.venueId,
            venueSectionId: section.id,
            rowLabel,
            seatNumber: String(c + 1),
            seatType: config.seatType,
            x: c * (config.seatWidth + config.horizontalGap) + config.seatWidth / 2 + 8,
            y: r * (config.seatHeight + config.verticalGap) + config.seatHeight / 2 + 28,
            width: config.seatWidth,
            height: config.seatHeight,
            rotation: 0,
            shape: config.seatShape,
            isAccessible: false,
            isActive: true,
          });
        }
      }
      dispatch({ type: "GENERATE_SEATS", sectionId, seats });
    },
    [state.venue.sections]
  );

  // ── Seats ──────────────────────────────────────────────────────────────────

  const updateSeat = useCallback(
    (sectionId: number, seatId: number, changes: Partial<LocalSeat>) => {
      dispatch({ type: "UPDATE_SEAT", sectionId, seatId, changes });
    },
    []
  );

  const deleteSeat = useCallback((sectionId: number, seatId: number) => {
    dispatch({ type: "DELETE_SEAT", sectionId, seatId });
  }, []);

  const deleteSelectedSeats = useCallback(
    (sectionId: number) => {
      dispatch({ type: "DELETE_SELECTED_SEATS", sectionId });
    },
    []
  );

  const selectSeat = useCallback((seatId: number, multi?: boolean) => {
    dispatch({ type: "SELECT_SEAT", seatId, multi: multi ?? isCtrlHeld.current });
  }, []);

  const deselectAllSeats = useCallback(() => {
    dispatch({ type: "DESELECT_ALL_SEATS" });
  }, []);

  const changeSelectedSeatsType = useCallback(
    (sectionId: number, seatType: SeatType) => {
      dispatch({ type: "CHANGE_SELECTED_SEATS_TYPE", sectionId, seatType });
    },
    []
  );

  const toggleSelectedSeatsAccessible = useCallback((sectionId: number) => {
    dispatch({ type: "TOGGLE_SELECTED_SEATS_ACCESSIBLE", sectionId });
  }, []);

  // ── Modal ──────────────────────────────────────────────────────────────────

  const openGenerateModal = useCallback(() => {
    dispatch({ type: "OPEN_GENERATE_MODAL" });
  }, []);

  const closeGenerateModal = useCallback(() => {
    dispatch({ type: "CLOSE_GENERATE_MODAL" });
  }, []);

  // ── Deletion tracking helpers ──────────────────────────────────────────────

  const clearDeletedIds = useCallback(() => {
    dispatch({ type: "CLEAR_DELETED_IDS" });
  }, []);

  // ── Convenience getters ────────────────────────────────────────────────────

  const selectedSection =
    state.venue.sections.find((s) => s.id === state.selectedSectionId) ?? null;

  const selectedSeats = selectedSection
    ? selectedSection.seats.filter((s) => state.selectedSeatIds.includes(s.id))
    : [];

  return {
    // state
    venue: state.venue,
    selectedSectionId: state.selectedSectionId,
    selectedSeatIds: state.selectedSeatIds,
    selectedSection,
    selectedSeats,
    isGenerateModalOpen: state.isGenerateModalOpen,
    isSaving: state.isSaving,
    deletedSectionIds: state.deletedSectionIds,
    deletedSeatIds: state.deletedSeatIds,
    savedSnapshot: state.savedSnapshot,

    // actions
    loadVenue,
    setVenueField,
    addSection,
    updateSection,
    deleteSection,
    selectSection,
    generateSeats,
    updateSeat,
    deleteSeat,
    deleteSelectedSeats,
    selectSeat,
    deselectAllSeats,
    changeSelectedSeatsType,
    toggleSelectedSeatsAccessible,
    openGenerateModal,
    closeGenerateModal,
    clearDeletedIds,

    // keyboard helpers
    onKeyDown,
    onKeyUp,
  };
}

export type VenueEditorAPI = ReturnType<typeof useVenueEditor>;
