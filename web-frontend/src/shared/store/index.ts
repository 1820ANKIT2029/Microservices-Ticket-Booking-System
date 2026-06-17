/**
 * shared/store — barrel export.
 *
 * Import stores from "@/shared/store" — never deep-import individual store files.
 */
export { useAuthStore }   from "./auth-store";
export type { AuthState } from "./auth-store";

export { useUiStore, useUIStore } from "./ui-store";   // useUIStore is @deprecated
export type { UiState }          from "./ui-store";

export { useFilterStore }    from "./filter-store";
export type { FilterState }  from "./filter-store";
