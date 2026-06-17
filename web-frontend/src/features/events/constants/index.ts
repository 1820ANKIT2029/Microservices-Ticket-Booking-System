import { EVENT_STATUS, EVENT_TYPE } from "@/shared/constants";

/**
 * Event feature constants.
 */
export const EVENT_ENDPOINTS = {
  base:     "/event/api/events",
  byId:     (id: string | number) => `/event/api/events/${id}`,
  featured: "/event/api/events/featured",
  category: (cat: string)         => `/event/api/events/category/${cat}`,
} as const;

export const VENUE_ENDPOINTS = {
  base: "/event/api/venues",
  byId: (id: string | number) => `/event/api/venues/${id}`,
} as const;

// Re-export shared constants so feature code only needs one import
export { EVENT_STATUS, EVENT_TYPE };
