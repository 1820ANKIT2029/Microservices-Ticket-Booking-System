import React from "react";
import Link from "next/link";
import { User, ChevronDown, LayoutDashboard, ShieldCheck, LogOut } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface UserDropdownProps {
  user: any;
  displayName: string;
  badge: { label: string; cls: string };
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  consumerMenuItems: any[];
  organizerMenuItems: any[];
  adminMenuItems: any[];
  isOrganizer: boolean;
  isAdmin: boolean;
  handleLogout: () => void;
}

export function UserDropdown({
  user,
  displayName,
  badge,
  isUserMenuOpen,
  setIsUserMenuOpen,
  consumerMenuItems,
  organizerMenuItems,
  adminMenuItems,
  isOrganizer,
  isAdmin,
  handleLogout,
}: UserDropdownProps) {
  return (
    <>
      <button
        onClick={() => setIsUserMenuOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-expanded={isUserMenuOpen}
        aria-haspopup="true"
        type="button"
      >
        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold overflow-hidden border border-primary/20">
          <User className="size-4" />
        </div>
        <div className="text-left hidden lg:block">
          <p className="text-xs font-bold text-foreground leading-none">{displayName}</p>
          <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5 inline-block", badge.cls)}>
            {badge.label}
          </span>
        </div>
        <ChevronDown className={cn("size-3.5 text-muted-foreground transition-transform", isUserMenuOpen && "rotate-180")} />
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card rounded-2xl border border-border shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 border-b border-border bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                <User className="size-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{displayName}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
              </div>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0", badge.cls)}>
                {badge.label}
              </span>
            </div>
          </div>

          <div className="py-1.5">
            <p className="px-4 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Account
            </p>
            {consumerMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                <item.icon className="size-4 text-muted-foreground shrink-0" />
                {item.label}
              </Link>
            ))}
          </div>

          {isOrganizer && (
            <div className="py-1.5 border-t border-border">
              <p className="px-4 py-1 text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                <LayoutDashboard className="size-3" />
                Organizer Tools
              </p>
              {organizerMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 transition-colors"
                >
                  <item.icon className="size-4 text-primary shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {isAdmin && (
            <div className="py-1.5 border-t border-border">
              <p className="px-4 py-1 text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck className="size-3" />
                Admin
              </p>
              {adminMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-amber-50 transition-colors"
                >
                  <item.icon className="size-4 text-amber-600 shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          <div className="py-1.5 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
              type="button"
            >
              <LogOut className="size-4 shrink-0" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
