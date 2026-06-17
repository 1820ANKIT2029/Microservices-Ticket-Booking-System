/**
 * Centralized React Query key factory.
 *
 * ALL query keys in the app MUST be defined here for cache consistency.
 * Each feature also exports its own typed key factory (see feature/query-keys.ts),
 * but the master registry lives here so invalidation patterns work globally.
 *
 * Moved from: shared/hooks/keys.ts
 */
export const queryKeys = {
  // ── Users ─────────────────────────────────────────────────────────────────
  user: {
    all:     ["user"] as const,
    profile: () => [...queryKeys.user.all, "profile"] as const,
    list:    () => [...queryKeys.user.all, "list"] as const,
    detail:  (id: string) => [...queryKeys.user.all, "detail", id] as const,
  },

  // ── Events ────────────────────────────────────────────────────────────────
  events: {
    all:    ["events"] as const,
    list:   (filters?: Record<string, unknown>) =>
      [...queryKeys.events.all, "list", filters ?? {}] as const,
    detail: (id: string | number) =>
      [...queryKeys.events.all, "detail", String(id)] as const,
    featured: () => [...queryKeys.events.all, "featured"] as const,
    byCategory: (category: string, page?: number, limit?: number) =>
      [...queryKeys.events.all, "category", category, { page, limit }] as const,
  },

  // ── Event Sessions ────────────────────────────────────────────────────────
  eventSessions: {
    all:    ["eventSessions"] as const,
    list:   (filters?: Record<string, unknown>) =>
      [...queryKeys.eventSessions.all, "list", filters ?? {}] as const,
    detail: (id: string | number) =>
      [...queryKeys.eventSessions.all, "detail", String(id)] as const,
    byEvent: (eventId: string | number) =>
      [...queryKeys.eventSessions.all, "event", String(eventId)] as const,
  },

  // ── Bookings ──────────────────────────────────────────────────────────────
  bookings: {
    all:     ["bookings"] as const,
    list:    () => [...queryKeys.bookings.all, "list"] as const,
    detail:  (id: string) => [...queryKeys.bookings.all, "detail", id] as const,
    loyalty: () => [...queryKeys.bookings.all, "loyalty"] as const,
  },

  // ── Venues ────────────────────────────────────────────────────────────────
  venues: {
    all:      ["venues"] as const,
    list:     () => [...queryKeys.venues.all, "list"] as const,
    detail:   (id: number | string) =>
      [...queryKeys.venues.all, "detail", String(id)] as const,
    sections: (venueId: number | string) =>
      [...queryKeys.venues.all, "sections", String(venueId)] as const,
  },

  // ── Venue Seat Map (canvas) ───────────────────────────────────────────────
  venueSeatMap: {
    all:     ["venueSeatMap"] as const,
    venue:   (venueId: number | string) =>
      [...queryKeys.venueSeatMap.all, "venue", String(venueId)] as const,
    sections: (venueId: number | string) =>
      [...queryKeys.venueSeatMap.all, "sections", String(venueId)] as const,
    seats:   (sectionId: number | string) =>
      [...queryKeys.venueSeatMap.all, "seats", String(sectionId)] as const,
  },

  // ── Seats ─────────────────────────────────────────────────────────────────
  seats: {
    all:       ["seats"] as const,
    bySection: (sectionId: number | string) =>
      [...queryKeys.seats.all, "section", String(sectionId)] as const,
    byEvent:   (eventId: number | string) =>
      [...queryKeys.seats.all, "event", String(eventId)] as const,
    bySession: (sessionId: number | string) =>
      [...queryKeys.seats.all, "session", String(sessionId)] as const,
  },

  // ── Search ────────────────────────────────────────────────────────────────
  search: {
    all:     ["search"] as const,
    results: (query: string, filters?: Record<string, unknown>) =>
      [...queryKeys.search.all, "results", query, filters ?? {}] as const,
  },

  // ── Admin ─────────────────────────────────────────────────────────────────
  admin: {
    all:    ["admin"] as const,
    venues: {
      all:    [...["admin"], "venues"] as const,
      list:   () => [...["admin"], "venues", "list"] as const,
      detail: (id: string | number) =>
        [...["admin"], "venues", "detail", String(id)] as const,
    },
    events: {
      all:    [...["admin"], "events"] as const,
      list:   (filters?: Record<string, unknown>) =>
        [...["admin"], "events", "list", filters ?? {}] as const,
      detail: (id: string | number) =>
        [...["admin"], "events", "detail", String(id)] as const,
    },
    sessions: {
      all:    [...["admin"], "sessions"] as const,
      list:   (filters?: Record<string, unknown>) =>
        [...["admin"], "sessions", "list", filters ?? {}] as const,
      detail: (id: string | number) =>
        [...["admin"], "sessions", "detail", String(id)] as const,
    },
  },
} as const;
