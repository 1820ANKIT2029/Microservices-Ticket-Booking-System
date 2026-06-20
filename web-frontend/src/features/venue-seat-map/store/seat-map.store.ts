"use client";

import { create } from "zustand";
import type {
  LocalVenue,
  LocalSection,
  LocalSeat,
  SeatGenerationConfig,
  SeatType,
} from "../types";

interface HistoryEntry {
  venue: LocalVenue;
  deletedSectionIds: number[];
  deletedSeatIds: Array<{ sectionId: number; seatId: number }>;
}

export interface SeatMapState {
  // Viewport / Zoom
  scale: number;
  pos: { x: number; y: number };

  // Interactive Selection
  selectedSectionId: number | null;
  selectedSeatIds: number[];

  // Editor Venue Data
  venue: LocalVenue;
  savedSnapshot: LocalVenue | null;
  deletedSectionIds: number[];
  deletedSeatIds: Array<{ sectionId: number; seatId: number }>;

  // Modals / Saving
  isGenerateModalOpen: boolean;
  isSaving: boolean;

  // History stacks
  past: HistoryEntry[];
  future: HistoryEntry[];

  // Temp ID generator
  tempIdCounter: number;

  // Viewport / Zoom Actions
  setScale: (scale: number) => void;
  setPos: (pos: { x: number; y: number }) => void;

  // Selection Actions
  setSelectedSectionId: (id: number | null) => void;
  setSelectedSeatIds: (ids: number[]) => void;
  selectSection: (id: number | null) => void;
  selectSeat: (seatId: number, multi: boolean) => void;
  deselectAllSeats: () => void;

  // Venue Data Mutations (with undo/redo capability)
  loadVenue: (venue: LocalVenue) => void;
  setVenueField: (field: keyof Omit<LocalVenue, "sections">, value: string | number | null) => void;
  addSection: () => void;
  updateSection: (id: number, changes: Partial<Omit<LocalSection, "id" | "seats">>) => void;
  deleteSection: (id: number) => void;
  generateSeats: (sectionId: number, config: SeatGenerationConfig) => void;
  updateSeat: (sectionId: number, seatId: number, changes: Partial<LocalSeat>) => void;
  deleteSeat: (sectionId: number, seatId: number) => void;
  deleteSelectedSeats: (sectionId: number) => void;
  changeSelectedSeatsType: (sectionId: number, seatType: SeatType) => void;
  toggleSelectedSeatsAccessible: (sectionId: number) => void;

  // Undo / Redo
  undo: () => void;
  redo: () => void;

  // Modal / Saving UI Actions
  openGenerateModal: () => void;
  closeGenerateModal: () => void;
  setSaving: (isSaving: boolean) => void;
  clearDeletedIds: () => void;

  // Reset
  resetStore: () => void;
}

const initialVenue: LocalVenue = {
  id: null,
  name: "New Venue",
  mapWidth: 1200,
  mapHeight: 800,
  sections: [],
};

// Helper to push to history stack
const createHistoryEntry = (state: SeatMapState): HistoryEntry => ({
  venue: JSON.parse(JSON.stringify(state.venue)),
  deletedSectionIds: [...state.deletedSectionIds],
  deletedSeatIds: [...state.deletedSeatIds],
});

export const useSeatMapStore = create<SeatMapState>((set, get) => ({
  // Viewport / Zoom Initial
  scale: 1,
  pos: { x: 0, y: 0 },

  // Interactive Selection Initial
  selectedSectionId: null,
  selectedSeatIds: [],

  // Venue Data Initial
  venue: initialVenue,
  savedSnapshot: null,
  deletedSectionIds: [],
  deletedSeatIds: [],

  // UI States Initial
  isGenerateModalOpen: false,
  isSaving: false,

  // History stacks
  past: [],
  future: [],

  tempIdCounter: -1,

  // Viewport / Zoom Actions
  setScale: (scale) => set({ scale }),
  setPos: (pos) => set({ pos }),

  // Selection Actions
  setSelectedSectionId: (id) => set({ selectedSectionId: id, selectedSeatIds: [] }),
  setSelectedSeatIds: (ids) => set({ selectedSeatIds: ids }),

  selectSection: (id) => set({ selectedSectionId: id, selectedSeatIds: [] }),

  selectSeat: (seatId, multi) =>
    set((state) => {
      const isSelected = state.selectedSeatIds.includes(seatId);
      let nextSelected: number[];
      if (multi) {
        nextSelected = isSelected
          ? state.selectedSeatIds.filter((id) => id !== seatId)
          : [...state.selectedSeatIds, seatId];
      } else {
        nextSelected = isSelected && state.selectedSeatIds.length === 1 ? [] : [seatId];
      }
      return { selectedSeatIds: nextSelected };
    }),

  deselectAllSeats: () => set({ selectedSeatIds: [] }),

  // Venue Data Mutations
  loadVenue: (venue) =>
    set({
      venue,
      savedSnapshot: JSON.parse(JSON.stringify(venue)),
      selectedSectionId: null,
      selectedSeatIds: [],
      deletedSectionIds: [],
      deletedSeatIds: [],
      past: [],
      future: [],
      scale: 1,
      pos: { x: 0, y: 0 },
      tempIdCounter: -1,
    }),

  setVenueField: (field, value) => {
    const currentEntry = createHistoryEntry(get());
    set((state) => ({
      past: [...state.past, currentEntry],
      future: [],
      venue: { ...state.venue, [field]: value },
    }));
  },

  addSection: () => {
    const currentEntry = createHistoryEntry(get());
    set((state) => {
      const newId = state.tempIdCounter;
      const newSection: LocalSection = {
        id: newId,
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

      return {
        past: [...state.past, currentEntry],
        future: [],
        tempIdCounter: state.tempIdCounter - 1,
        venue: {
          ...state.venue,
          sections: [...state.venue.sections, newSection],
        },
        selectedSectionId: newId,
        selectedSeatIds: [],
      };
    });
  },

  updateSection: (id, changes) => {
    const currentEntry = createHistoryEntry(get());
    set((state) => ({
      past: [...state.past, currentEntry],
      future: [],
      venue: {
        ...state.venue,
        sections: state.venue.sections.map((s) =>
          s.id === id ? { ...s, ...changes } : s
        ),
      },
    }));
  },

  deleteSection: (id) => {
    const currentEntry = createHistoryEntry(get());
    const wasAlreadySaved = id > 0;
    set((state) => ({
      past: [...state.past, currentEntry],
      future: [],
      venue: {
        ...state.venue,
        sections: state.venue.sections.filter((s) => s.id !== id),
      },
      selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
      selectedSeatIds: [],
      deletedSectionIds: wasAlreadySaved
        ? [...state.deletedSectionIds, id]
        : state.deletedSectionIds,
      deletedSeatIds: state.deletedSeatIds.filter((d) => d.sectionId !== id),
    }));
  },

  generateSeats: (sectionId, config) => {
    const currentEntry = createHistoryEntry(get());
    set((state) => {
      const section = state.venue.sections.find((s) => s.id === sectionId);
      if (!section) return {};

      const seats: LocalSeat[] = [];
      const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const startIdx = rowLabels.indexOf(config.startRowLabel.toUpperCase());
      let seatIdCounter = state.tempIdCounter;

      for (let r = 0; r < config.rows; r++) {
        const rowLabel = rowLabels[(startIdx + r) % rowLabels.length];
        for (let c = 0; c < config.seatsPerRow; c++) {
          seats.push({
            id: seatIdCounter,
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
          seatIdCounter--;
        }
      }

      const stalePersistedSeats = section.seats
        .filter((s) => s.id > 0)
        .map((s) => ({ sectionId, seatId: s.id }));

      return {
        past: [...state.past, currentEntry],
        future: [],
        tempIdCounter: seatIdCounter,
        venue: {
          ...state.venue,
          sections: state.venue.sections.map((s) =>
            s.id === sectionId ? { ...s, seats } : s
          ),
        },
        deletedSeatIds: [...state.deletedSeatIds, ...stalePersistedSeats],
      };
    });
  },

  updateSeat: (sectionId, seatId, changes) => {
    const currentEntry = createHistoryEntry(get());
    set((state) => ({
      past: [...state.past, currentEntry],
      future: [],
      venue: {
        ...state.venue,
        sections: state.venue.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                seats: s.seats.map((seat) =>
                  seat.id === seatId ? { ...seat, ...changes } : seat
                ),
              }
            : s
        ),
      },
    }));
  },

  deleteSeat: (sectionId, seatId) => {
    const currentEntry = createHistoryEntry(get());
    const wasAlreadySaved = seatId > 0;
    set((state) => ({
      past: [...state.past, currentEntry],
      future: [],
      venue: {
        ...state.venue,
        sections: state.venue.sections.map((s) =>
          s.id === sectionId
            ? { ...s, seats: s.seats.filter((seat) => seat.id !== seatId) }
            : s
        ),
      },
      selectedSeatIds: state.selectedSeatIds.filter((id) => id !== seatId),
      deletedSeatIds: wasAlreadySaved
        ? [...state.deletedSeatIds, { sectionId, seatId }]
        : state.deletedSeatIds,
    }));
  },

  deleteSelectedSeats: (sectionId) => {
    const currentEntry = createHistoryEntry(get());
    set((state) => {
      const section = state.venue.sections.find((s) => s.id === sectionId);
      const seatsToDelete = section
        ? section.seats.filter((s) => state.selectedSeatIds.includes(s.id))
        : [];
      const newDeletedSeatIds = [
        ...state.deletedSeatIds,
        ...seatsToDelete
          .filter((s) => s.id > 0)
          .map((s) => ({ sectionId, seatId: s.id })),
      ];

      return {
        past: [...state.past, currentEntry],
        future: [],
        venue: {
          ...state.venue,
          sections: state.venue.sections.map((s) =>
            s.id === sectionId
              ? { ...s, seats: s.seats.filter((seat) => !state.selectedSeatIds.includes(seat.id)) }
              : s
          ),
        },
        selectedSeatIds: [],
        deletedSeatIds: newDeletedSeatIds,
      };
    });
  },

  changeSelectedSeatsType: (sectionId, seatType) => {
    const currentEntry = createHistoryEntry(get());
    set((state) => ({
      past: [...state.past, currentEntry],
      future: [],
      venue: {
        ...state.venue,
        sections: state.venue.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                seats: s.seats.map((seat) =>
                  state.selectedSeatIds.includes(seat.id)
                    ? { ...seat, seatType }
                    : seat
                ),
              }
            : s
        ),
      },
    }));
  },

  toggleSelectedSeatsAccessible: (sectionId) => {
    const currentEntry = createHistoryEntry(get());
    set((state) => ({
      past: [...state.past, currentEntry],
      future: [],
      venue: {
        ...state.venue,
        sections: state.venue.sections.map((s) =>
          s.id === sectionId
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
    }));
  },

  // Undo / Redo Actions
  undo: () =>
    set((state) => {
      if (state.past.length === 0) return {};
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      const currentEntry = createHistoryEntry(state);

      return {
        past: newPast,
        future: [...state.future, currentEntry],
        venue: previous.venue,
        deletedSectionIds: previous.deletedSectionIds,
        deletedSeatIds: previous.deletedSeatIds,
        // Reset selections to avoid selecting missing items
        selectedSectionId: null,
        selectedSeatIds: [],
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return {};
      const next = state.future[state.future.length - 1];
      const newFuture = state.future.slice(0, state.future.length - 1);
      const currentEntry = createHistoryEntry(state);

      return {
        past: [...state.past, currentEntry],
        future: newFuture,
        venue: next.venue,
        deletedSectionIds: next.deletedSectionIds,
        deletedSeatIds: next.deletedSeatIds,
        selectedSectionId: null,
        selectedSeatIds: [],
      };
    }),

  // Modal / Saving UI Actions
  openGenerateModal: () => set({ isGenerateModalOpen: true }),
  closeGenerateModal: () => set({ isGenerateModalOpen: false }),
  setSaving: (isSaving) => set({ isSaving }),
  clearDeletedIds: () => set({ deletedSectionIds: [], deletedSeatIds: [] }),

  // Reset Store
  resetStore: () =>
    set({
      scale: 1,
      pos: { x: 0, y: 0 },
      selectedSectionId: null,
      selectedSeatIds: [],
      venue: initialVenue,
      savedSnapshot: null,
      deletedSectionIds: [],
      deletedSeatIds: [],
      isGenerateModalOpen: false,
      isSaving: false,
      past: [],
      future: [],
      tempIdCounter: -1,
    }),
}));
