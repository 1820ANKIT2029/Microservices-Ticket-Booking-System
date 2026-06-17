"use client";

import { useQuery } from "@tanstack/react-query";
import { UserService } from "../api/service";
import { userKeys } from "../query-keys";
import { toUserList } from "../mapper";
import type { User } from "../types";

/**
 * Fetches all users — admin use only.
 */
export function useUsers() {
  return useQuery<User[]>({
    queryKey: userKeys.list(),
    queryFn:  async () => {
      const res = await UserService.getAllUsers();
      return toUserList(res.data.data);
    },
  });
}
