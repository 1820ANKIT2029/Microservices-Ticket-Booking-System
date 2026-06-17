/**
 * Local storage key constants.
 * Never use raw strings like "token" — always import TOKEN_KEY.
 */
export const TOKEN_KEY = "token" as const;
export const AUTH_STORAGE_KEY = "eventpass-auth-storage" as const;

/**
 * Seat type constants — must match backend enum values exactly.
 */
export const SEAT_TYPE = {
  STANDARD: "STANDARD",
  PREMIUM:  "PREMIUM",
  VIP:      "VIP",
  ECONOMY:  "ECONOMY",
} as const;

export type SeatType = (typeof SEAT_TYPE)[keyof typeof SEAT_TYPE];

/**
 * Seat shape constants for the venue canvas editor.
 */
export const SEAT_SHAPE = {
  CIRCLE:    "circle",
  RECTANGLE: "rectangle",
} as const;

export type SeatShape = (typeof SEAT_SHAPE)[keyof typeof SEAT_SHAPE];
