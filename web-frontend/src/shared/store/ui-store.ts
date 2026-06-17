import { create } from "zustand";

export interface UiState {
  sidebarOpen:  boolean;
  activeModals: Record<string, boolean>;
  toggleSidebar: (force?: boolean) => void;
  openModal:     (modalId: string) => void;
  closeModal:    (modalId: string) => void;
  isModalOpen:   (modalId: string) => boolean;
}

export const useUiStore = create<UiState>()((set, get) => ({
  sidebarOpen:  false,
  activeModals: {},

  toggleSidebar: (force) =>
    set((state) => ({
      sidebarOpen: force !== undefined ? force : !state.sidebarOpen,
    })),

  openModal: (modalId) =>
    set((state) => ({
      activeModals: { ...state.activeModals, [modalId]: true },
    })),

  closeModal: (modalId) =>
    set((state) => ({
      activeModals: { ...state.activeModals, [modalId]: false },
    })),

  isModalOpen: (modalId) => get().activeModals[modalId] ?? false,
}));

/**
 * @deprecated Use `useUiStore` (camelCase) instead.
 */
export const useUIStore = useUiStore;
