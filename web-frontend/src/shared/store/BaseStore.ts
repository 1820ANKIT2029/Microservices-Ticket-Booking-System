import { createStore, StoreApi, StateCreator } from "zustand/vanilla";
import { useStore } from "zustand";

/**
 * Base OOP Store class that encapsulates a Zustand vanilla store.
 * Extend this class to create specific domain stores.
 */
export abstract class BaseStore<T> {
  protected store: StoreApi<T>;

  constructor(initializer: StateCreator<T>) {
    this.store = createStore<T>()(initializer);
  }

  /**
   * Get the current state synchronously.
   */
  public getState(): T {
    return this.store.getState();
  }

  /**
   * Set the state programmatically.
   */
  protected setState(
    partial: T | Partial<T> | ((state: T) => T | Partial<T>),
    replace?: boolean
  ): void {
    this.store.setState(partial, replace as any);
  }

  /**
   * Subscribe to state changes outside of React components.
   */
  public subscribe(listener: (state: T, prevState: T) => void) {
    return this.store.subscribe(listener);
  }

  /**
   * React Hook to bind the store to a React component.
   * Usage: const value = store.useSelector(state => state.value);
   */
  public useSelector = <U = T>(selector?: (state: T) => U): U => {
    return useStore(this.store, selector as any);
  };
}
