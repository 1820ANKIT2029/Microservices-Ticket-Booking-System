/**
 * Payment and booking status constants — must match backend enum values exactly.
 */
export const PAYMENT_STATUS = {
  PENDING:  "PENDING",
  SUCCESS:  "SUCCESS",
  FAILED:   "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

/**
 * Booking status constants.
 */
export const BOOKING_STATUS = {
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  PENDING:   "PENDING",
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];
