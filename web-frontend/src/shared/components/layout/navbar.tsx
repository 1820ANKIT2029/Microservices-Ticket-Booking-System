"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, Bell, MapPin, Menu, X, User, ChevronDown,
  LayoutDashboard, Map, Users, Settings, ShieldCheck,
  Ticket, LogOut, UserCircle, Clock,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { useAuthStore } from "@/shared/store";
import { useRole } from "@/shared/hooks/useRole";

const NAV_LINKS = [
  { label: "Movies", href: "/movies" },
  { label: "Sports", href: "/sports" },
  { label: "Music",  href: "/music"  },
];

const ROLE_BADGE: Record<string, { label: string; cls: string }> = {
  CONSUMER:   { label: "Consumer",   cls: "bg-muted text-muted-foreground" },
  ORGANIZER:  { label: "Organizer",  cls: "bg-primary/10 text-primary" },
  ADMIN:      { label: "Admin",      cls: "bg-amber-100 text-amber-700" },
};

export function Navbar() {
  const router    = useRouter();
  const pathname  = usePathname();
  const { role, isOrganizer, isAdmin } = useRole();
  const user      = useAuthStore((s) => s.user);
  const logout    = useAuthStore((s) => s.logout);

  const [isScrolled,        setIsScrolled]        = useState(false);
  const [isMobileMenuOpen,  setIsMobileMenuOpen]  = useState(false);
  const [isAuthenticated,   setIsAuthenticated]   = useState(false);
  const [isUserMenuOpen,    setIsUserMenuOpen]     = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      setIsAuthenticated(!!token);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    router.push("/auth/signin");
  };

  if (pathname?.startsWith("/auth")) return null;

  const badge = ROLE_BADGE[role] ?? ROLE_BADGE.CONSUMER;
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : "My Account";

  const consumerMenuItems = [
    { label: "My Profile",  href: "/profile",            icon: UserCircle },
    { label: "My Bookings", href: "/profile?tab=bookings", icon: Ticket    },
    { label: "Settings",    href: "/profile?tab=security", icon: Settings  },
  ];

  const organizerMenuItems = [
    { label: "Events",         href: "/events",         icon: LayoutDashboard },
    { label: "Event Sessions", href: "/event-sessions", icon: Clock         },
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
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-label-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg px-2 py-1",
                    isActive
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-on-surface-variant hover:text-primary"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAuthenticated && isOrganizer && (
              <Link
                href={isAdmin ? "/admin/venues" : "/events"}
                className={cn(
                  "text-label-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-2 py-1 flex items-center gap-1.5",
                  pathname?.startsWith("/admin") || pathname?.startsWith("/events") || pathname?.startsWith("/event-sessions")
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
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            type="button"
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-outline-variant/10 bg-surface px-4 py-4" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
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
      )}
    </header>
  );
}
