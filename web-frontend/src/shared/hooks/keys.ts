/**
 * Centralized React Query key factory.
 * All query keys in the app MUST be defined here for cache consistency.
 */
export const queryKeys = {
  // ── Users ────────────────────────────────────────────────────────────────
  user: {
    all:     ["user"] as const,
    profile: () => [...queryKeys.user.all, "profile"] as const,
    list:    () => [...queryKeys.user.all, "list"] as const,
    detail:  (id: string) => [...queryKeys.user.all, "detail", id] as const,
  },

  // ── Events ───────────────────────────────────────────────────────────────
  events: {
    all:    ["events"] as const,
    list:   (filters?: Record<string, unknown>) =>
      [...queryKeys.events.all, "list", filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.events.all, "detail", id] as const,
  },

  // ── Event Sessions ───────────────────────────────────────────────────────
  eventSessions: {
    all:    ["eventSessions"] as const,
    list:   () => [...queryKeys.eventSessions.all, "list"] as const,
    detail: (id: string | number) => [...queryKeys.eventSessions.all, "detail", String(id)] as const,
  },

  // ── Bookings ─────────────────────────────────────────────────────────────
  bookings: {
    all:     ["bookings"] as const,
    list:    () => [...queryKeys.bookings.all, "list"] as const,
    detail:  (id: string) => [...queryKeys.bookings.all, "detail", id] as const,
    loyalty: () => [...queryKeys.bookings.all, "loyalty"] as const,
  },

  // ── Venues ───────────────────────────────────────────────────────────────
  venues: {
    all:     ["venues"] as const,
    list:    () => [...queryKeys.venues.all, "list"] as const,
    detail:  (id: number | string) => [...queryKeys.venues.all, "detail", String(id)] as const,
    sections:(venueId: number | string) =>
      [...queryKeys.venues.all, "sections", String(venueId)] as const,
  },

  // ── Seats ────────────────────────────────────────────────────────────────
  seats: {
    all:          ["seats"] as const,
    bySection:    (sectionId: number | string) =>
      [...queryKeys.seats.all, "section", String(sectionId)] as const,
    byEvent:      (eventId: number | string) =>
      [...queryKeys.seats.all, "event", String(eventId)] as const,
  },

  // ── Search ───────────────────────────────────────────────────────────────
  search: {
    all:     ["search"] as const,
    results: (query: string, filters?: Record<string, unknown>) =>
      [...queryKeys.search.all, "results", query, filters ?? {}] as const,
  },
} as const;
