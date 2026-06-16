"use client";

import * as React from "react";
import {
  User, Shield, Bell, CreditCard, Ticket,
  LayoutDashboard, Map, Users, Settings, ShieldCheck, Clock,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useRole } from "@/shared/hooks/useRole";

export type ProfileTab =
  | "personal"
  | "bookings"
  | "security"
  | "notifications"
  | "payments"
  // organizer tabs
  | "admin-venues"
  | "admin-events"
  | "admin-sessions"
  // admin tabs
  | "admin-users"
  | "admin-settings";

interface ProfileSidebarProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  userEmail: string;
  userFullName: string;
  userAvatar: string;
}

// ── Tab definitions ────────────────────────────────────────────────────────────

const CONSUMER_TABS = [
  { id: "personal"      as const, label: "Personal Info",    icon: User      },
  { id: "bookings"      as const, label: "My Bookings",      icon: Ticket    },
  { id: "security"      as const, label: "Security",         icon: Shield    },
  { id: "notifications" as const, label: "Notifications",    icon: Bell      },
  { id: "payments"      as const, label: "Saved Payments",   icon: CreditCard },
];

const ORGANIZER_TABS = [
  { id: "admin-events" as const, label: "Events", icon: LayoutDashboard  },
  { id: "admin-sessions" as const, label: "Event Sessions", icon: Clock  },
];

const ADMIN_TABS = [
  { id: "admin-venues" as const, label: "Venues", icon: Map              },
  { id: "admin-users"    as const, label: "User Management", icon: Users      },
  { id: "admin-settings" as const, label: "System Settings", icon: ShieldCheck },
];

// ── Role badge ────────────────────────────────────────────────────────────────

const ROLE_BADGE: Record<string, { label: string; cls: string }> = {
  CONSUMER:   { label: "Consumer",   cls: "bg-muted text-muted-foreground" },
  ORGANIZER:  { label: "Organizer",  cls: "bg-primary/10 text-primary" },
  ADMIN:      { label: "Admin",      cls: "bg-amber-100 text-amber-700" },
};

// ── Shared tab button ─────────────────────────────────────────────────────────

function TabButton({
  tab,
  isActive,
  onTabChange,
  variant = "default",
}: {
  tab: { id: ProfileTab; label: string; icon: React.ElementType };
  isActive: boolean;
  onTabChange: (tab: ProfileTab) => void;
  variant?: "default" | "organizer" | "admin";
}) {
  const Icon = tab.icon;

  const activeColor =
    variant === "admin"
      ? "text-amber-600 bg-amber-50 font-bold"
      : variant === "organizer"
      ? "text-primary bg-primary/5 font-bold"
      : "text-primary bg-secondary-container font-bold";

  const iconColor =
    variant === "admin"     ? "text-amber-600" :
    variant === "organizer" ? "text-primary"   : "";

  return (
    <button
      key={tab.id}
      onClick={() => onTabChange(tab.id)}
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-label-md font-semibold transition-all rounded-lg cursor-pointer text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isActive
          ? activeColor
          : "text-on-surface-variant hover:bg-surface-container-highest/60 hover:text-primary"
      )}
    >
      <Icon
        className={cn(
          "size-5",
          isActive ? iconColor || "text-primary" : "text-outline"
        )}
      />
      <span>{tab.label}</span>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ProfileSidebar({
  activeTab,
  onTabChange,
  userEmail,
  userFullName,
  userAvatar,
}: ProfileSidebarProps) {
  const { role, isOrganizer, isAdmin } = useRole();
  const badge = ROLE_BADGE[role] ?? ROLE_BADGE.CONSUMER;

  const allMobileTabs = [
    ...CONSUMER_TABS,
    ...(isOrganizer ? ORGANIZER_TABS : []),
    ...(isAdmin ? ADMIN_TABS : []),
  ];

  return (
    <>
      {/* Mobile Top Scrollable Navigation */}
      <div className="md:hidden w-full border-b border-outline-variant/30 bg-surface-container-low px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {allMobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-label-md font-semibold shrink-0 cursor-pointer transition-all",
                isActive
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface border border-outline-variant/50 text-on-surface-variant hover:border-primary"
              )}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Vertical Sidebar */}
      <aside className="hidden md:flex h-[calc(100vh-64px)] w-64 sticky top-16 flex-col gap-2 py-6 border-r border-outline-variant/30 bg-surface-container-low overflow-y-auto no-scrollbar">
        {/* User Card Header */}
        <div className="px-6 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-fixed border border-outline-variant/50 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={userAvatar || "https://placehold.net/avatar-5.png"}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-label-md text-on-surface truncate">
                {userFullName}
              </h3>
              <p className="text-label-sm text-on-surface-variant/80 truncate">
                {userEmail}
              </p>
              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-0.5", badge.cls)}>
                {badge.label}
              </span>
            </div>
          </div>
        </div>

        {/* ── Consumer tabs ── */}
        <nav className="flex flex-col gap-0.5 px-3" aria-label="Profile navigation">
          <p className="px-4 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Account
          </p>
          {CONSUMER_TABS.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onTabChange={onTabChange}
              variant="default"
            />
          ))}
        </nav>

        {/* ── Organizer tabs ── */}
        {isOrganizer && (
          <nav className="flex flex-col gap-0.5 px-3 pt-2 border-t border-outline-variant/30 mt-1" aria-label="Organizer navigation">
            <p className="px-4 py-1 text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
              <LayoutDashboard className="size-3" />
              Organizer Tools
            </p>
            {ORGANIZER_TABS.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                onTabChange={onTabChange}
                variant="organizer"
              />
            ))}
          </nav>
        )}

        {/* ── Admin tabs ── */}
        {isAdmin && (
          <nav className="flex flex-col gap-0.5 px-3 pt-2 border-t border-outline-variant/30 mt-1" aria-label="Admin navigation">
            <p className="px-4 py-1 text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="size-3" />
              Admin Tools
            </p>
            {ADMIN_TABS.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                onTabChange={onTabChange}
                variant="admin"
              />
            ))}
          </nav>
        )}

        {/* Footer card */}
        <div className="px-6 mt-auto pt-4">
          <div className="p-4 rounded-xl border border-primary-container/20 bg-primary/5 text-center space-y-2">
            <p className="text-label-sm text-on-surface-variant font-medium">
              Want premium features?
            </p>
            <button className="w-full py-2.5 bg-primary text-on-primary font-bold text-label-sm rounded-lg hover:opacity-90 transition-opacity cursor-pointer border-none shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
