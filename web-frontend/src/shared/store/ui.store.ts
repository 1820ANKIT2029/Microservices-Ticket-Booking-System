import { BaseStore } from "./BaseStore";

export interface UIState {
  sidebarOpen: boolean;
  activeModals: Record<string, boolean>;
}

class UIStore extends BaseStore<UIState> {
  constructor() {
    super(() => ({
      sidebarOpen: false,
      activeModals: {},
    }));
  }

  public toggleSidebar = (force?: boolean) => {
    this.setState((state) => ({
      sidebarOpen: force !== undefined ? force : !state.sidebarOpen,
    }));
  };

  public openModal = (modalId: string) => {
    this.setState((state) => ({
      activeModals: { ...state.activeModals, [modalId]: true },
    }));
  };

  public closeModal = (modalId: string) => {
    this.setState((state) => ({
      activeModals: { ...state.activeModals, [modalId]: false },
    }));
  };
}

export const uiStore = new UIStore();
export const useUIStore = uiStore.useSelector;
