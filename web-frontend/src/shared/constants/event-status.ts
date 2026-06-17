/**
 * Event status constants — must match backend enum values exactly.
 */
export const EVENT_STATUS = {
  DRAFT:     "DRAFT",
  PUBLISHED: "PUBLISHED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;

export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];

/**
 * Event type / category constants.
 */
export const EVENT_TYPE = {
  MOVIE:   "MOVIE",
  CONCERT: "CONCERT",
  SPORTS:  "SPORTS",
  OTHER:   "OTHER",
} as const;

export type EventType = (typeof EVENT_TYPE)[keyof typeof EVENT_TYPE];

/**
 * Session status constants.
 */
export const SESSION_STATUS = {
  SCHEDULED: "SCHEDULED",
  LIVE:      "LIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type SessionStatus = (typeof SESSION_STATUS)[keyof typeof SESSION_STATUS];
