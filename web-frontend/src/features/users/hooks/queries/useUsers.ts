import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { ApiResponse } from "@/shared/types/api-response";
import { queryKeys } from "@/shared/hooks/keys";
import { UserProfileData } from "../../types/profile";

export function useUsers() {
  return useQuery<UserProfileData[]>({
    queryKey: queryKeys.user.list(),
    queryFn: () => api.get<ApiResponse<UserProfileData[]>>("/users").then((res) => res.data.data),
  });
}
