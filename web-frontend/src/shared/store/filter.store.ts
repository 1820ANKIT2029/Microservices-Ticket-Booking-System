import { SearchFilters } from "@/features/search/types/search";
import { BaseStore } from "./BaseStore";

export interface FilterState {
  search: string;
  sort: string;
  page: number;
  limit: number;
  filters: SearchFilters;
}

const initialFilters: SearchFilters = {
  categories: [],
  dates: [],
  maxPrice: 500,
  venue: null,
};

class FilterStore extends BaseStore<FilterState> {
  constructor() {
    super(() => ({
      search: "",
      sort: "recommended",
      page: 1,
      limit: 3,
      filters: initialFilters,
    }));
  }

  public setSearch = (search: string) => {
    this.setState({ search, page: 1 });
  };

  public setSort = (sort: string) => {
    this.setState({ sort, page: 1 });
  };

  public setPage = (page: number) => {
    this.setState({ page });
  };

  public setFilters = (filters: Partial<SearchFilters>) => {
    this.setState((state) => ({
      filters: { ...state.filters, ...filters },
      page: 1,
    }));
  };

  public resetFilters = () => {
    this.setState({
      search: "",
      sort: "recommended",
      page: 1,
      filters: initialFilters,
    });
  };
}

export const filterStore = new FilterStore();
export const useFilterStore = filterStore.useSelector;
