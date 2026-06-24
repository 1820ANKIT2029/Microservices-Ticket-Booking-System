"use client";

import { useState, useMemo } from "react";
import { FormatUtils } from "@/shared/utils";
import { SportsCategories } from "./sports-categories";
import { TrendingEvents } from "./trending-events";
import { MatchesNearYou } from "./matches-near-you";
import { TRENDING_SPORTS_EVENTS } from "../constants/sports-data";
import { eventQueries } from "@/features/events/hooks/EventQueryService";
import { SportEvent } from "../types/sports";

export function SportsContentSection() {
  const [activeCategory, setActiveCategory] = useState("all-sports");
  const [page, setPage] = useState(1);
  const limit = 3;

  // Load sports events from backend
  const { data: events = [], isLoading } = eventQueries.useEvents({ category: "sports" });

  // Map API data (SportsMatch) to SportEvent structure or use local fallback
  const displayedEvents = useMemo(() => {
    if (events && events.length > 0) {
      return events.map((match: any) => {
        return {
          id: String(match.id),
          title: match.title || `${match.homeTeam?.name || "Team A"} vs ${match.awayTeam?.name || "Team B"}`,
          category: match.league || "Cricket",
          location: match.venue || "Stadium",
          date: match.time ? FormatUtils.formatDate(match.time) : "Today",
          priceText: "From ₹499",
          tagType: match.status === "live" ? "primary" : "secondary",
          imageUrl: match.homeTeam?.logoUrl || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600",
          imageAlt: match.title || "Match image"
        } as SportEvent;
      });
    }

    // Fallback: Paginated local mock events filtered by category
    const filteredMock = TRENDING_SPORTS_EVENTS.filter((event) => {
      if (activeCategory === "all-sports") return true;
      const cat = event.category.toLowerCase();
      const active = activeCategory.toLowerCase();

      if (active === "cricket") {
        return cat === "cricket" || cat.includes("ipl");
      }

      return cat === active;
    });

    const start = (page - 1) * limit;
    return filteredMock.slice(start, start + limit);
  }, [events, activeCategory, page, limit]);

  const hasNextPage = useMemo(() => {
    if (events && events.length > 0) {
      return events.length === limit;
    }
    
    // Check fallback list length
    const filteredMock = TRENDING_SPORTS_EVENTS.filter((event) => {
      if (activeCategory === "all-sports") return true;
      const cat = event.category.toLowerCase();
      const active = activeCategory.toLowerCase();

      if (active === "cricket") {
        return cat === "cricket" || cat.includes("ipl");
      }

      return cat === active;
    });

    return (page * limit) < filteredMock.length;
  }, [events, activeCategory, page, limit]);

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setPage(1); // Reset page to 1 on category change
  };

  return (
    <>
      <div className="mt-8">
        <SportsCategories activeCategory={activeCategory} onSelectCategory={handleCategorySelect} />
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <TrendingEvents
            events={displayedEvents}
            page={page}
            onPageChange={setPage}
            hasNextPage={hasNextPage}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-4">
          <MatchesNearYou />
        </div>
      </div>
    </>
  );
}
