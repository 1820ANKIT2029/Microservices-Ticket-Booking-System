import { useQuery } from "@tanstack/react-query";
import { UserService } from "../../services/user.service";
import { queryKeys } from "@/shared/hooks/keys";
import { useAuthStore } from "@/shared/store";
import { UserProfileData } from "../../types/profile";

export function useUser() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasToken = !!accessToken || (typeof window !== "undefined" && !!localStorage.getItem("token"));

  return useQuery<UserProfileData>({
    queryKey: queryKeys.user.profile(),
    queryFn: () => UserService.getProfile().then((res) => res.data.data),
    enabled: hasToken,
  });
}
