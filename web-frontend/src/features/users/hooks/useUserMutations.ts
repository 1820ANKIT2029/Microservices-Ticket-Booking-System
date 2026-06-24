"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "../api/service";
import { userKeys } from "../query-keys";
import { toUserProfileData } from "../mapper";
import { useAuthStore, authStore } from "@/shared/store";
import type { UserProfileData } from "../types";

/**
 * Mutation hook for updating the authenticated user's profile.
 * On success, invalidates the profile query and syncs the auth store.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser     = authStore.setUser;

  return useMutation({
    mutationFn: (data: Partial<UserProfileData>) =>
      UserService.updateProfile(data),

    onSuccess: (updatedProfile) => {
      // Sync updated profile into auth store
      setUser(updatedProfile);
      // Invalidate so useUser refetches fresh data
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
}
