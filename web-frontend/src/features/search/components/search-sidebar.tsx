"use client";

import { SearchFilters } from "../types/search";

interface SearchSidebarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}

const CATEGORIES = ["Sports", "Music", "Arts", "Food"] as const;
const VENUES = ["Lord's Stadium", "The Oval", "Old Trafford"] as const;

export function SearchSidebar({ filters, onChange }: SearchSidebarProps) {
  const handleDateChange = (dateType: string, checked: boolean) => {
    let updatedDates = [...filters.dates];
    if (checked) {
      if (!updatedDates.includes(dateType)) {
        updatedDates.push(dateType);
      }
    } else {
      updatedDates = updatedDates.filter((d) => d !== dateType);
    }
    onChange({ ...filters, dates: updatedDates });
  };

  const handlePriceChange = (val: number) => {
    onChange({ ...filters, maxPrice: val });
  };

  const handleCategoryToggle = (category: string) => {
    let updatedCats = [...filters.categories];
    if (updatedCats.includes(category)) {
      updatedCats = updatedCats.filter((c) => c !== category);
    } else {
      updatedCats.push(category);
    }
    onChange({ ...filters, categories: updatedCats });
  };

  const handleVenueChange = (venue: string | null) => {
    onChange({ ...filters, venue });
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 space-y-6" aria-label="Search filters">
      {/* Date Filter */}
      <section className="space-y-3">
        <h3 className="font-bold text-base text-on-surface">Date</h3>
        <div className="space-y-2.5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.dates.includes("today")}
              onChange={(e) => handleDateChange("today", e.target.checked)}
              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
            />
            <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">
              Today
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.dates.includes("tomorrow")}
              onChange={(e) => handleDateChange("tomorrow", e.target.checked)}
              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
            />
            <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">
              Tomorrow
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.dates.includes("weekend")}
              onChange={(e) => handleDateChange("weekend", e.target.checked)}
              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
            />
            <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">
              This Weekend
            </span>
          </label>
        </div>
      </section>

      <div className="h-px bg-outline-variant/30" />

      {/* Price Range */}
      <section className="space-y-3">
        <h3 className="font-bold text-base text-on-surface">Price Range</h3>
        <div className="px-1 space-y-2">
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className="w-full h-1 bg-secondary-container rounded-lg appearance-none cursor-pointer accent-primary"
            aria-label="Maximum price filter"
          />
          <div className="flex justify-between text-xs text-on-surface-variant font-semibold">
            <span>₹0</span>
            <span className="text-primary font-bold">Max: ₹{filters.maxPrice}</span>
            <span>₹500+</span>
          </div>
        </div>
      </section>

      <div className="h-px bg-outline-variant/30" />

      {/* Category */}
      <section className="space-y-3">
        <h3 className="font-bold text-base text-on-surface">Category</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = filters.categories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryToggle(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container border border-outline-variant hover:border-primary text-on-surface"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      <div className="h-px bg-outline-variant/30" />

      {/* Venue */}
      <section className="space-y-3">
        <h3 className="font-bold text-base text-on-surface">Venue</h3>
        <div className="space-y-2.5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="venue"
              checked={filters.venue === null}
              onChange={() => handleVenueChange(null)}
              className="w-5 h-5 border-outline-variant text-primary focus:ring-primary cursor-pointer"
            />
            <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">
              All Venues
            </span>
          </label>
          {VENUES.map((v) => (
            <label key={v} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="venue"
                checked={filters.venue === v}
                onChange={() => handleVenueChange(v)}
                className="w-5 h-5 border-outline-variant text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">
                {v}
              </span>
            </label>
          ))}
        </div>
      </section>
    </aside>
  );
}
