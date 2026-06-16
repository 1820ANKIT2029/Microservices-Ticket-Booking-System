"use client";

import { useState } from "react";
import { Filter } from "lucide-react";

export function FilterBar() {
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [format, setFormat] = useState("");

  const handleClearAll = () => {
    setGenre("");
    setLanguage("");
    setFormat("");
  };

  return (
    <section
      className="sticky top-20 z-40 bg-background/80 backdrop-blur-xl border-b border-outline-variant/20 transition-all duration-300"
      aria-label="Filter Toolbar"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 pr-4 border-r border-outline-variant/30 text-on-surface">
            <Filter className="size-4 text-primary" aria-hidden="true" />
            <span className="text-label-md font-bold">Filters</span>
          </div>

          {/* Genre select */}
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="bg-surface-container-low border-none rounded-lg text-body-md px-4 py-2 text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
            aria-label="Filter by Genre"
          >
            <option value="">Genre</option>
            <option value="Action">Action</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Comedy">Comedy</option>
            <option value="Thriller">Thriller</option>
            <option value="Animation">Animation</option>
          </select>

          {/* Language select */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-surface-container-low border-none rounded-lg text-body-md px-4 py-2 text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
            aria-label="Filter by Language"
          >
            <option value="">Language</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
          </select>

          {/* Format select */}
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="bg-surface-container-low border-none rounded-lg text-body-md px-4 py-2 text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
            aria-label="Filter by Format"
          >
            <option value="">Format</option>
            <option value="IMAX">IMAX</option>
            <option value="3D">3D</option>
            <option value="2D">2D</option>
          </select>
        </div>

        {/* Clear All action */}
        {(genre || language || format) && (
          <button
            type="button"
            onClick={handleClearAll}
            className="bg-surface-container-highest text-on-surface px-5 py-2 rounded-full text-label-md font-bold hover:bg-primary hover:text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all active:scale-95"
          >
            Clear All
          </button>
        )}
      </div>
    </section>
  );
}
