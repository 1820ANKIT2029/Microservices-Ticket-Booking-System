"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchSidebar } from "./search-sidebar";
import { SearchResultsList } from "./search-results-list";
import { SearchResultEvent, SearchFilters } from "../types/search";
import { ChevronRight, ChevronLeft, Search, Loader2 } from "lucide-react";
import { SearchService } from "@/features/search";
import { EventService } from "@/features/events";

interface SearchClientProps {
  initialQuery?: string;
}

type SortType = "recommended" | "price-asc" | "date-asc";

const PAGE_SIZE = 3;

function formatEventDate(dateString?: string) {
  if (!dateString) return "Upcoming Session";
  try {
    const d = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayName = days[d.getDay()];
    const monthName = months[d.getMonth()];
    const day = d.getDate();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${dayName}, ${monthName} ${day} • ${hours}:${minutes}`;
  } catch {
    return "Upcoming Session";
  }
}

export function SearchClient({ initialQuery = "" }: SearchClientProps) {
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

  // 1. Fetch Venues for location lookup mapping
  const { data: venues = [] } = useQuery({
    queryKey: ["venues"],
    queryFn: () => EventService.getVenues(),
  });

  // 2. Paginated Event Catalog Search from Microservice
  const { data: apiEventsPage, isLoading: isSearchLoading } = useQuery({
    queryKey: ["searchCatalog", searchQuery, filters, currentPage, sortBy],
    queryFn: () => {
      const status = "PUBLISHED";
      let eventType: string | undefined;

      if (filters.categories && filters.categories.length > 0) {
        const cat = filters.categories[0].toLowerCase();
        if (cat.includes("movie")) eventType = "MOVIE";
        else if (cat.includes("music") || cat.includes("concert")) eventType = "CONCERT";
        else if (cat.includes("sport")) eventType = "SPORTS";
      }

      const sort = sortBy === "price-asc"
        ? ["price,asc"]
        : sortBy === "date-asc"
        ? ["createdAt,desc"]
        : undefined;

      return SearchService.searchEventsCatalog(
        searchQuery || undefined,
        status,
        eventType,
        currentPage - 1, // backend is 0-indexed
        PAGE_SIZE,
        sort
      );
    },
  });

  // 3. Fetch detailed event information for the search results on current page
  const eventIds = useMemo(() => {
    return apiEventsPage?.content?.map((e) => e.id) || [];
  }, [apiEventsPage]);

  const { data: detailedEvents, isLoading: isDetailsLoading } = useQuery({
    queryKey: ["detailedEvents", eventIds],
    queryFn: async () => {
      if (eventIds.length === 0) return [];
      const promises = eventIds.map((id) => EventService.getEventById(id));
      return Promise.all(promises);
    },
    enabled: eventIds.length > 0,
  });

  // 4. Map detailed event data to UI consumed SearchResultEvent shape
  const apiMappedEvents = useMemo(() => {
    if (!detailedEvents || detailedEvents.length === 0) return [];

    const venueMap = new Map(venues.map((v) => [v.id, v]));
    const friendlyCategory: Record<string, string> = {
      MOVIE: "Movies",
      CONCERT: "Music",
      SPORTS: "Sports",
      OTHER: "Special Event",
    };

    return detailedEvents.map((e) => {
      let minPrice = Infinity;
      let dateString = e.createdAt || new Date().toISOString();

      if (e.sessions && e.sessions.length > 0) {
        const session = e.sessions[0];
        dateString = session.startDataTime || dateString;

        if (session.ticketTypes && session.ticketTypes.length > 0) {
          session.ticketTypes.forEach((t) => {
            if (t.basePrice < minPrice) {
              minPrice = t.basePrice;
            }
          });
        }
      }

      const venue = e.venueId ? venueMap.get(e.venueId) : null;
      const venueName = venue?.name || "Main Venue";
      const locationText = venue ? `${venue.name}, ${venue.city || ""}` : "Main Venue";

      const price = minPrice !== Infinity ? minPrice : 45;
      const priceText = minPrice !== Infinity ? (minPrice === 0 ? "Free" : `$${minPrice}`) : "$45";

      return {
        id: String(e.id),
        title: e.title,
        category: friendlyCategory[e.eventType || "OTHER"] || "Special Event",
        price,
        priceText,
        date: dateString,
        dateText: formatEventDate(dateString),
        location: locationText,
        imageUrl: e.bannerUrl || "https://placehold.co/600x400/5400c3/ffffff/png?text=" + encodeURIComponent(e.title),
        imageAlt: e.title,
        venue: venueName,
      };
    });
  }, [detailedEvents, venues]);

  // Determine active display data
  const displayEvents = apiMappedEvents || [];
  const displayCount = apiEventsPage?.totalElements || 0;
  const displayTotalPages = apiEventsPage?.totalPages || 1;

  const isLoading = isSearchLoading || (eventIds.length > 0 && isDetailsLoading);

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
            {displayCount} results {searchQuery && `for '${searchQuery}'`}
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
            <SearchResultsList events={displayEvents} />
          )}

          {/* Pagination Controls */}
          {displayCount > PAGE_SIZE && !isLoading && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-low text-on-surface-variant disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-all focus-visible:outline-none"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-5" />
              </button>
              {Array.from({ length: displayTotalPages }).map((_, i) => {
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
                disabled={currentPage === displayTotalPages}
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
