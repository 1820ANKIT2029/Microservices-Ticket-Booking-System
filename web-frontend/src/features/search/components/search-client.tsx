"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchSidebar } from "./search-sidebar";
import { SearchResultsList } from "./search-results-list";
import { SearchResultEvent, SearchFilters } from "../types/search";
import { ChevronRight, ChevronLeft, Search, Loader2 } from "lucide-react";
import { SearchService } from "@/features/search/services/search.service";

interface SearchClientProps {
  initialEvents: SearchResultEvent[];
  initialQuery?: string;
}

type SortType = "recommended" | "price-asc" | "date-asc";

const PAGE_SIZE = 3;

export function SearchClient({ initialEvents, initialQuery = "" }: SearchClientProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortType>("recommended");
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<SearchFilters>({
    categories: initialQuery ? [] : [],
    dates: [],
    maxPrice: 500,
    venue: null,
  });

  // Backend search API query
  const { data: apiEvents, isLoading } = useQuery({
    queryKey: ["search", searchQuery, filters],
    queryFn: () => SearchService.searchEvents(searchQuery, filters).then((res) => res.data.data),
  });

  // Local fallback filter logic
  const filteredEvents = useMemo(() => {
    return initialEvents.filter((event) => {
      // 1. Search text match
      if (searchQuery.trim()) {
        const queryLower = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(queryLower);
        const matchesLoc = event.location.toLowerCase().includes(queryLower);
        const matchesCategory = event.category.toLowerCase().includes(queryLower);
        if (!matchesTitle && !matchesLoc && !matchesCategory) {
          return false;
        }
      }

      // 2. Category match
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(event.category)) {
          return false;
        }
      }

      // 3. Price match
      if (event.price > filters.maxPrice) {
        return false;
      }

      // 4. Venue match
      if (filters.venue && event.venue !== filters.venue) {
        return false;
      }

      // 5. Date match
      if (filters.dates.length > 0) {
        let matchesDate = false;
        const dateStr = event.date.split("T")[0]; // YYYY-MM-DD
        
        filters.dates.forEach((dateFilter) => {
          if (dateFilter === "today" && dateStr === "2026-10-12") {
            matchesDate = true;
          }
          if (dateFilter === "tomorrow" && dateStr === "2026-10-13") {
            matchesDate = true;
          }
          if (dateFilter === "weekend" && (dateStr === "2026-10-12" || dateStr === "2026-10-13")) {
            matchesDate = true;
          }
        });

        if (!matchesDate) {
          return false;
        }
      }

      return true;
    });
  }, [initialEvents, searchQuery, filters]);

  // Map API events with local fallback
  const activeEventsList = useMemo(() => {
    if (apiEvents && apiEvents.length > 0) {
      return apiEvents;
    }
    return filteredEvents;
  }, [apiEvents, filteredEvents]);

  // Dynamic sort logic
  const sortedAndFilteredEvents = useMemo(() => {
    const list = [...activeEventsList];
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "date-asc") {
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    return list;
  }, [activeEventsList, sortBy]);

  // Pagination bounds
  const totalPages = Math.max(1, Math.ceil(sortedAndFilteredEvents.length / PAGE_SIZE));
  
  const paginatedEvents = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    return sortedAndFilteredEvents.slice(startIdx, startIdx + PAGE_SIZE);
  }, [sortedAndFilteredEvents, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  return (
    <div className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-16 py-8">
      {/* Search Input Bar (Header Area) */}
      <div className="w-full mb-8">
        <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
          <input
            type="text"
            placeholder="Search for events, sports, artists..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/60 rounded-full py-3 pl-12 pr-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface"
            aria-label="Search events"
          />
          <Search className="absolute left-4 top-3.5 text-on-surface-variant size-5" />
          <button
            type="submit"
            className="absolute right-2.5 top-1.5 bg-primary text-on-primary font-semibold text-xs py-2 px-4 rounded-full hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-on-surface-variant mb-2">
            <span className="text-xs font-semibold">Home</span>
            <ChevronRight className="size-3.5 text-on-surface-variant/50" />
            <span className="text-xs font-semibold">Search</span>
            {searchQuery && (
              <>
                <ChevronRight className="size-3.5 text-on-surface-variant/50" />
                <span className="text-xs font-semibold text-primary">{searchQuery}</span>
              </>
            )}
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
            {sortedAndFilteredEvents.length} results {searchQuery && `for '${searchQuery}'`}
          </h1>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-on-surface-variant">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortType);
              setCurrentPage(1);
            }}
            className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm font-semibold focus:ring-primary focus:border-primary text-on-surface cursor-pointer focus-visible:outline-none"
            aria-label="Sort events option selector"
          >
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="date-asc">Date: Soonest</option>
          </select>
        </div>
      </div>

      {/* Grid structure layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <SearchSidebar
          filters={filters}
          onChange={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1);
          }}
        />

        {/* Events Grid & Pagination container */}
        <div className="flex-grow flex flex-col justify-between min-h-[500px]">
          {isLoading ? (
            <div className="flex-grow flex flex-col items-center justify-center p-12">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-on-surface-variant font-semibold">Searching events...</p>
            </div>
          ) : (
            <SearchResultsList events={paginatedEvents} />
          )}

          {/* Pagination Controls */}
          {sortedAndFilteredEvents.length > PAGE_SIZE && !isLoading && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-low text-on-surface-variant disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-all focus-visible:outline-none"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-5" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold text-sm transition-all focus-visible:outline-none ${
                      isActive
                        ? "bg-primary text-on-primary shadow-md"
                        : "border border-outline-variant hover:bg-surface-container-low text-on-surface cursor-pointer"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-low text-on-surface-variant disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-all focus-visible:outline-none"
                aria-label="Next page"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
