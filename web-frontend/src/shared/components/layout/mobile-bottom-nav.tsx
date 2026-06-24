"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Trophy, Music } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const NAV_TABS = [
  { href: "/", label: "Home", icon: Home },
  // { href: "/movies", label: "Movies", icon: Film },
  // { href: "/sports", label: "Sports", icon: Trophy },
  // { href: "/music", label: "Music", icon: Music },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-outline-variant/30 flex justify-around py-2.5 z-50 px-6 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]"
      aria-label="Mobile Navigation Bar"
    >
      {NAV_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-3 py-1 transition-all",
              isActive
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            )}
            aria-current={isActive ? "page" : undefined}
            aria-label={`${tab.label}${isActive ? " (Active)" : ""}`}
          >
            <Icon className={cn("size-5", isActive && "fill-primary/10")} aria-hidden="true" />
            <span className="text-[10px]">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
