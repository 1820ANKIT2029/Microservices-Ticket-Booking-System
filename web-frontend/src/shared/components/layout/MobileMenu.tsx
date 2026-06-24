import React from "react";
import Link from "next/link";
import { MapPin, User, LayoutDashboard, ShieldCheck, LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";

interface MobileMenuProps {
  pathname: string;
  navLinks: { label: string; href: string }[];
  isAuthenticated: boolean;
  isOrganizer: boolean;
  isAdmin: boolean;
  user: any;
  displayName: string;
  badge: { label: string; cls: string };
  consumerMenuItems: any[];
  organizerMenuItems: any[];
  adminMenuItems: any[];
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
}

export function MobileMenu({
  pathname,
  navLinks,
  isAuthenticated,
  isOrganizer,
  isAdmin,
  user,
  displayName,
  badge,
  consumerMenuItems,
  organizerMenuItems,
  adminMenuItems,
  setIsMobileMenuOpen,
  handleLogout,
}: MobileMenuProps) {
  return (
    <nav className="md:hidden border-t border-outline-variant/10 bg-surface px-4 py-4" aria-label="Mobile navigation">
      <div className="flex flex-col gap-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "text-label-md font-semibold py-2.5 px-3 rounded-xl transition-colors",
                isActive ? "text-primary bg-primary/5" : "text-on-surface-variant hover:text-primary hover:bg-accent"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
        <button
          type="button"
          className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-on-surface-variant text-label-md font-semibold hover:text-primary hover:bg-accent transition-colors w-full text-left"
        >
          <MapPin className="size-4" />
          Location
        </button>

        {isAuthenticated ? (
          <div className="flex flex-col gap-1 pt-2 border-t border-outline-variant/10 mt-1">
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                <User className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{displayName}</p>
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", badge.cls)}>
                  {badge.label}
                </span>
              </div>
            </div>

            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Account</p>
            {consumerMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-label-md font-semibold text-on-surface-variant hover:text-primary hover:bg-accent transition-colors"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}

            {isOrganizer && (
              <>
                <p className="px-3 text-[10px] font-bold text-primary uppercase tracking-widest mt-2">Organizer Tools</p>
                {organizerMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-label-md font-semibold text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    <item.icon className="size-4 text-primary" />
                    {item.label}
                  </Link>
                ))}
              </>
            )}

            {isAdmin && (
              <>
                <p className="px-3 text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-2">Admin Tools</p>
                {adminMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-label-md font-semibold text-on-surface-variant hover:text-amber-600 hover:bg-amber-50 transition-colors"
                  >
                    <item.icon className="size-4 text-amber-600" />
                    {item.label}
                  </Link>
                ))}
              </>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-label-md font-semibold text-destructive hover:bg-destructive/5 transition-colors w-full text-left mt-1"
              type="button"
            >
              <LogOut className="size-4" />
              Sign Out
            </button>
          </div>
        ) : (
          <Button
            asChild
            className="bg-primary-container text-on-primary rounded-full px-6 text-label-md font-semibold hover:opacity-90 w-full mt-2"
          >
            <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
              Sign In
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
