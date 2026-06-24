"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, Bell, MapPin, Menu, X,
  LayoutDashboard, Map, Users, Settings, ShieldCheck,
  Ticket, Clock, UserCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { useAuthStore, authStore } from "@/shared/store";
import { useRole } from "@/shared/hooks/useRole";
import { UserDropdown } from "./UserDropdown";
import { MobileMenu } from "./MobileMenu";

const ROLE_BADGE: Record<string, { label: string; cls: string }> = {
  CONSUMER:  { label: "Consumer",  cls: "bg-muted text-muted-foreground" },
  ORGANIZER: { label: "Organizer", cls: "bg-primary/10 text-primary" },
  ADMIN:     { label: "Admin",     cls: "bg-amber-100 text-amber-700" },
};

export function Navbar() {
  const router    = useRouter();
  const pathname  = usePathname();
  const { role, isOrganizer, isAdmin } = useRole();
  const user        = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout      = authStore.logout;

  // Single source of truth: Zustand store (persisted) + localStorage fallback for first render
  const isAuthenticated =
    !!accessToken || (typeof window !== "undefined" && !!localStorage.getItem("token"));

  const [isScrolled,       setIsScrolled]       = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen,   setIsUserMenuOpen]    = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    router.push("/auth/signin");
  }, [logout, router]);

  if (pathname?.startsWith("/auth")) return null;

  const badge = ROLE_BADGE[role] ?? ROLE_BADGE.CONSUMER;
  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "My Account";

  const consumerMenuItems = [
    { label: "My Profile",  href: "/profile",             icon: UserCircle },
    { label: "My Bookings", href: "/profile?tab=bookings", icon: Ticket    },
    { label: "Settings",    href: "/profile?tab=security", icon: Settings  },
  ];
  const organizerMenuItems = [
    { label: "Events",         href: "/events",         icon: LayoutDashboard },
    { label: "Event Sessions", href: "/event-sessions", icon: Clock           },
  ];
  const adminMenuItems = [
    { label: "Venues",          href: "/admin/venues",   icon: Map        },
    { label: "User Management", href: "/admin/users",    icon: Users      },
    { label: "System Settings", href: "/admin/settings", icon: ShieldCheck },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-surface/95 backdrop-blur-xl border-b border-outline-variant/10 shadow-sm"
          : "bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10"
      )}
      role="banner"
    >
      <div className="flex justify-between items-center w-full px-4 md:px-16 py-4 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="text-headline-md font-black text-primary tracking-tighter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
            aria-label="EventPass Home"
          >
            EventPass
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {isAuthenticated && isOrganizer && (
              <Link
                href={isAdmin ? "/admin/venues" : "/events"}
                className={cn(
                  "text-label-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-2 py-1 flex items-center gap-1.5",
                  pathname?.startsWith("/admin") ||
                  pathname?.startsWith("/events") ||
                  pathname?.startsWith("/event-sessions")
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-primary"
                )}
              >
                <LayoutDashboard className="size-3.5" />
                {isAdmin ? "Admin Console" : "Organizer Dashboard"}
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="p-2 hover:bg-surface-container-highest/50 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary inline-flex"
            aria-label="Search"
          >
            <Search className="size-5" />
          </Link>

          <button
            className="p-2 hover:bg-surface-container-highest/50 rounded-full transition-all relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Notifications"
            type="button"
          >
            <Bell className="size-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" aria-hidden="true" />
          </button>

          <button
            className="hidden md:flex items-center gap-2 px-4 py-2 text-on-surface-variant text-label-md font-semibold hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
            aria-label="Select location"
            type="button"
          >
            <MapPin className="size-4" />
            Location
          </button>

          {isAuthenticated ? (
            <div className="hidden md:block relative" ref={userMenuRef}>
              <UserDropdown
                user={user}
                displayName={displayName}
                badge={badge}
                isUserMenuOpen={isUserMenuOpen}
                setIsUserMenuOpen={setIsUserMenuOpen}
                consumerMenuItems={consumerMenuItems}
                organizerMenuItems={organizerMenuItems}
                adminMenuItems={adminMenuItems}
                isOrganizer={isOrganizer}
                isAdmin={isAdmin}
                handleLogout={handleLogout}
              />
            </div>
          ) : (
            <Button
              asChild
              className="bg-primary-container text-on-primary rounded-full px-6 text-label-md font-semibold hover:opacity-90 active:scale-95 transition-all hidden md:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              size="lg"
            >
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          )}

          <button
            className="md:hidden p-2 hover:bg-surface-container-highest/50 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            type="button"
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <MobileMenu
          pathname={pathname}
          navLinks={[]}
          isAuthenticated={isAuthenticated}
          isOrganizer={isOrganizer}
          isAdmin={isAdmin}
          user={user}
          displayName={displayName}
          badge={badge}
          consumerMenuItems={consumerMenuItems}
          organizerMenuItems={organizerMenuItems}
          adminMenuItems={adminMenuItems}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          handleLogout={handleLogout}
        />
      )}
    </header>
  );
}
