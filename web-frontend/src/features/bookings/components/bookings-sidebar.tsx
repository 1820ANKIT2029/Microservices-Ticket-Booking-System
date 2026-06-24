"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
const HELP_LINKS = [
  { label: "Transfer a Ticket", href: "#" },
  { label: "Refund Policy", href: "#" },
  { label: "Contact Event Host", href: "#" },
];

export function BookingsSidebar() {
  return (
    <aside className="w-full flex flex-col gap-6" aria-label="Account status and help">
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
