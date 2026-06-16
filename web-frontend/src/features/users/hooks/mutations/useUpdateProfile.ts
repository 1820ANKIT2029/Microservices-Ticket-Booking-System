import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "../../services/user.service";
import { queryKeys } from "@/shared/hooks/keys";
import { UserProfileData } from "../../types/profile";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserProfileData>) =>
      UserService.updateProfile(data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
  });
}
