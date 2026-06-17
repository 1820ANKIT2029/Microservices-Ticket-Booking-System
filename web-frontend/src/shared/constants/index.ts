/**
 * shared/constants — barrel export.
 *
 * Import from "@/shared/constants" instead of deep-importing individual files.
 */
export { ROUTES } from "./routes";
export { USER_ROLE, ROLE_HIERARCHY, hasMinimumRole } from "./user-role";
export type { UserRole } from "./user-role";
export { EVENT_STATUS, EVENT_TYPE, SESSION_STATUS } from "./event-status";
export type { EventStatus, EventType, SessionStatus } from "./event-status";
export { PAYMENT_STATUS, BOOKING_STATUS } from "./payment-status";
export type { PaymentStatus, BookingStatus } from "./payment-status";
export { TOKEN_KEY, AUTH_STORAGE_KEY, SEAT_TYPE, SEAT_SHAPE } from "./app";
export type { SeatType, SeatShape } from "./app";
export { queryKeys } from "./query-keys";
