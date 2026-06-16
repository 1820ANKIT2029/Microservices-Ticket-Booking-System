"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LoyaltyStats } from "../types/bookings";

interface BookingsSidebarProps {
  loyaltyStats: LoyaltyStats;
}

const HELP_LINKS = [
  { label: "Transfer a Ticket", href: "#" },
  { label: "Refund Policy", href: "#" },
  { label: "Contact Event Host", href: "#" },
];

export function BookingsSidebar({ loyaltyStats }: BookingsSidebarProps) {
  const progressPercent = Math.min(
    100,
    Math.max(0, (loyaltyStats.points / loyaltyStats.targetPoints) * 100)
  );

  return (
    <aside className="w-full flex flex-col gap-6" aria-label="Account status and help">
      {/* Loyalty Card */}
      <div className="glass-card rounded-xl p-6 bg-primary-container text-on-primary-container relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex flex-col gap-4">
          <h3 className="font-bold text-lg leading-tight text-white">
            Loyalty Rewards
          </h3>
          <p className="text-sm text-white/90 leading-relaxed">
            You&apos;ve attended {loyaltyStats.attendedCount} events this year. You&apos;re 2 bookings away from Gold status!
          </p>
          <div className="w-full">
            <div className="w-full bg-white/20 h-2 rounded-full mb-1.5" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-white/80">
              {progressPercent}% towards next reward
            </span>
          </div>
        </div>
        {/* Decorative background shape */}
        <div
          className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Need Help Card */}
      <div className="glass-card rounded-xl p-6 border border-outline-variant/30 bg-surface-container-lowest shadow-sm">
        <h3 className="font-bold text-xs text-on-surface-variant uppercase tracking-widest mb-4">
          Need Help?
        </h3>
        <ul className="divide-y divide-outline-variant/30" role="list">
          {HELP_LINKS.map((link) => (
            <li key={link.label} role="listitem">
              <Link
                href={link.href}
                className="flex items-center justify-between py-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1 transition-all"
                aria-label={`Go to ${link.label}`}
              >
                <span className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                  {link.label}
                </span>
                <ChevronRight
                  className="size-5 text-on-surface-variant group-hover:text-primary transition-colors shrink-0"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
