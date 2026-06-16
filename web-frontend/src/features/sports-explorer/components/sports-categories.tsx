import { cn } from "@/shared/utils/cn";
import { SPORT_CATEGORIES } from "../constants/sports-data";

// Custom inline SVGs for sports categories to avoid external fonts dependency
function SportIcon({ name, className }: { name: string; className?: string }) {
  const baseClass = className || "size-6";
  switch (name) {
    case "sports_cricket":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass}>
          {/* Cricket Bat */}
          <path d="M18.5 3.5a2.12 2.12 0 0 0-3-3l-11.5 11.5v3h3z" />
          <path d="M5.5 15.5 2 19l3 3 3.5-3.5" />
          {/* Cricket Ball */}
          <circle cx="18" cy="18" r="2" fill="currentColor" />
        </svg>
      );
    case "sports_soccer":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      );
    case "sports_tennis":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass}>
          <circle cx="10" cy="10" r="7" />
          <path d="M5.5 14.5 2 18l4 4 3.5-3.5" />
          <circle cx="17" cy="17" r="2.5" />
        </svg>
      );
    case "sports_motorsports":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v6M12 16v6M2 12h6M16 12h6" />
        </svg>
      );
    case "sports_basketball":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass}>
          <circle cx="12" cy="12" r="10" />
          <path d="M6.2 6.2c2.4 2.4 2.4 6.4 0 8.8M17.8 6.2c-2.4 2.4-2.4 6.4 0 8.8M2 12h20M12 2v20" />
        </svg>
      );
    case "sports_kabaddi":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass}>
          {/* Custom representation of Kabaddi court/tackle */}
          <rect x="2" y="4" width="20" height="14" rx="2" />
          <path d="M12 4v14M7 4v14M17 4v14" />
        </svg>
      );
    case "grid_view":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      );
    default:
      return null;
  }
}

interface SportsCategoriesProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export function SportsCategories({ activeCategory, onSelectCategory }: SportsCategoriesProps) {
  return (
    <section className="mb-8" aria-labelledby="sports-categories-title">
      <h2 id="sports-categories-title" className="text-headline-md font-bold mb-4 text-on-background">
        Browse by Sport
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth" aria-label="Sports categories">
        {SPORT_CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              aria-pressed={isActive}
              className={cn(
                "flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isActive
                  ? "bg-primary-container text-on-primary shadow-md scale-105"
                  : "bg-surface-container text-on-surface hover:bg-primary-fixed hover:text-on-primary-fixed-variant"
              )}
            >
              <SportIcon name={category.iconName} className="size-7" />
              <span className="text-label-sm font-bold">{category.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
