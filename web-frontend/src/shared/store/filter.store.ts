import { create } from "zustand";
import { SearchFilters } from "@/features/search/types/search";

export interface FilterState {
  search: string;
  sort: string;
  page: number;
  limit: number;
  filters: SearchFilters;
  setSearch: (search: string) => void;
  setSort: (sort: string) => void;
  setPage: (page: number) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
}

const initialFilters: SearchFilters = {
  categories: [],
  dates: [],
  maxPrice: 500,
  venue: null,
};

export const useFilterStore = create<FilterState>()((set) => ({
  search: "",
  sort: "recommended",
  page: 1,
  limit: 3,
  filters: initialFilters,
  setSearch: (search) => set({ search, page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  setPage: (page) => set({ page }),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      page: 1,
    })),
  resetFilters: () =>
    set({
      search: "",
      sort: "recommended",
      page: 1,
      filters: initialFilters,
    }),
}));
