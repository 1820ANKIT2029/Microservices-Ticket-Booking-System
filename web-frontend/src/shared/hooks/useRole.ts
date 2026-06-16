"use client";

import { useAuthStore } from "@/shared/store";
import { getRoleFromToken, AppRole } from "@/shared/utils/jwt";
import { useMemo } from "react";

/**
 * Returns the current user's role and handy permission helpers.
 * Role is read from the Zustand store (persisted from JWT on login).
 * Falls back to decoding the token live from localStorage for
 * the legacy code paths that set the token without going through
 * useAuthStore.login().
 */
export function useRole() {
  const storeRole = useAuthStore((s) => s.role);
  const setRole   = useAuthStore((s) => s.setRole);

  const role: AppRole = useMemo(() => {
    // If store already has a role (set via login()), trust it
    if (storeRole && storeRole !== "CONSUMER") return storeRole;

    // Fallback: decode live from localStorage (handles legacy signin paths)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        const liveRole = getRoleFromToken(token);
        // Sync back into store so subsequent renders are fast
        if (liveRole !== storeRole) setRole(liveRole);
        return liveRole;
      }
    }
    return storeRole ?? "CONSUMER";
  }, [storeRole, setRole]);

  return {
    role,
    isConsumer:  role === "CONSUMER",
    isOrganizer: role === "ORGANIZER" || role === "ADMIN",
    isAdmin:     role === "ADMIN",
    /** True when user has at least the given role level */
    hasRole: (required: AppRole) => {
      const hierarchy: AppRole[] = ["CONSUMER", "ORGANIZER", "ADMIN"];
      return hierarchy.indexOf(role) >= hierarchy.indexOf(required);
    },
  };
}
