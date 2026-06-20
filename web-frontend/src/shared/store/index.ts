/**
 * shared/store — barrel export.
 *
 * Import stores from "@/shared/store" — never deep-import individual store files.
 */
export { useAuthStore }   from "./auth.store";
export type { AuthState } from "./auth.store";

export { useUIStore } from "./ui.store";
export type { UIState }          from "./ui.store";

export { useFilterStore }    from "./filter.store";
export type { FilterState }  from "./filter.store";
