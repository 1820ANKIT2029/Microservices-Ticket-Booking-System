import { create } from "zustand";

export interface UIState {
  sidebarOpen: boolean;
  activeModals: Record<string, boolean>;
  toggleSidebar: (force?: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: false,
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
}));
