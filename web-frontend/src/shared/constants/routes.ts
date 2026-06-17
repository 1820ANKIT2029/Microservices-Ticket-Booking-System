/**
 * Application route constants.
 * Use these instead of hardcoded string paths anywhere in the codebase.
 */
export const ROUTES = {
  home: "/",

  auth: {
    root:   "/auth",
    login:  "/auth?tab=login",
    signup: "/auth?tab=signup",
  },

  events: {
    list:   "/events",
    detail: (id: string | number) => `/events/${id}`,
  },

  eventSessions: {
    detail: (id: string | number) => `/event-sessions/${id}`,
  },

  movies:  "/movies",
  music:   "/music",
  sports:  "/sports",
  search:  "/search",
  profile: "/profile",

  bookings: {
    list:   "/bookings",
    detail: (id: string) => `/bookings/${id}`,
  },

  checkout: {
    root:      "/checkout",
    withEvent: (eventId: string | number) => `/checkout?eventId=${eventId}`,
  },

  confirmation: {
    success: "/confirmed",
    failed:  "/failed",
  },

  onboarding: "/onboarding",

  admin: {
    root:    "/admin",
    venues:  "/admin/venues",
    events:  "/admin/events",
    sessions: "/admin/sessions",
    users:   "/admin/users",
  },
} as const;
