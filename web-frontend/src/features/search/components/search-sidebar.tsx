"use client";

import { SearchFilters } from "../types/search";

interface SearchSidebarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}

const CATEGORIES = ["Concerts", "Sports", "Movies"] as const;

export function SearchSidebar({ filters, onChange }: SearchSidebarProps) {
  const handleCategoryToggle = (category: string) => {
    let updatedCats = [...filters.categories];
    if (updatedCats.includes(category)) {
      updatedCats = updatedCats.filter((c) => c !== category);
    } else {
      updatedCats = [category]; // single category selection
    }
    onChange({ ...filters, categories: updatedCats });
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 space-y-6" aria-label="Search filters">
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
    </aside>
  );
}
