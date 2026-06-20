"use client";

import { useState, useEffect } from "react";
import { cn } from "@/shared/utils/cn";
import Link from "next/link";

interface ActionBarProps {
  priceText: string;
  eventId: string;
  selectedSessionId?: string | number | null;
  selectedSessionText?: string;
}

export function ActionBar({ priceText, eventId, selectedSessionId, selectedSessionText }: ActionBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 400;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "sticky top-16 z-40 bg-surface/95 border-b border-outline-variant/35 backdrop-blur-md transition-all duration-300",
        isScrolled ? "shadow-md" : "shadow-none"
      )}
      role="region"
      aria-label="Ticket booking bar"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 h-16 flex items-center">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className="text-on-surface-variant text-label-md font-semibold">From</span>
            <span className="text-primary font-bold text-headline-md">{priceText}</span>
          </div>
          {selectedSessionText && (
            <span className="text-[10px] md:text-xs text-muted-foreground font-semibold">
              Selected Session: {selectedSessionText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
