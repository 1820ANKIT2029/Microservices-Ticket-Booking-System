/**
 * User role constants.
 * AppRole type is the canonical role type across auth, stores, and guards.
 */
export const USER_ROLE = {
  CONSUMER:  "CONSUMER",
  ORGANIZER: "ORGANIZER",
  ADMIN:     "ADMIN",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

/** Ordered hierarchy — CONSUMER < ORGANIZER < ADMIN */
export const ROLE_HIERARCHY: UserRole[] = ["CONSUMER", "ORGANIZER", "ADMIN"];

/**
 * Returns true if `userRole` meets or exceeds the `requiredRole` level.
 */
export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY.indexOf(userRole) >= ROLE_HIERARCHY.indexOf(requiredRole);
}
