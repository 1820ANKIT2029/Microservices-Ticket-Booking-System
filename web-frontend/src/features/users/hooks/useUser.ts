"use client";

import { useQuery } from "@tanstack/react-query";
import { UserService } from "../api/service";
import { userKeys } from "../query-keys";
import { toUser } from "../mapper";
import { useAuthStore } from "@/shared/store";
import type { User } from "../types";

/**
 * Fetches and returns the authenticated user as a typed domain User model.
 * Query is disabled when no auth token is present.
 */
export function useUser() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasToken = !!accessToken || (typeof window !== "undefined" && !!localStorage.getItem("token"));

  return useQuery<User>({
    queryKey: userKeys.profile(),
    queryFn:  async () => {
      const res = await UserService.getUser();
      return toUser(res.data.data);
    },
    enabled: hasToken,
  });
}
