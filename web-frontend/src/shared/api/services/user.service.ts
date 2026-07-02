import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import type { UserResponseDto, UserProfileData } from "@/features/users/types";
import { rawDtoToProfileData } from "@/features/users/mapper";
import { JwtUtils } from "@/shared/utils";
import { TOKEN_KEY } from "@/shared/constants";
import { AuthService } from "./auth.service";

/**
 * UserService — all HTTP calls for the users domain.
 */
export class UserService {
  static getUser() {
    return api.get<ApiResponse<UserResponseDto>>("/user/api/users");
  }

  static async getProfile(): Promise<UserProfileData> {
    const response  = await UserService.getUser();
    const userDto   = response.data;

    if (!userDto) {
      throw new Error("Invalid profile response from server");
    }

    return rawDtoToProfileData(userDto as unknown as Record<string, unknown>);
  }

  static async updateProfile(data: Partial<UserProfileData>): Promise<UserProfileData> {
    const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (!token) throw new Error("No authorization token found.");

    const userId = JwtUtils.getUserIdFromToken(token);
    if (!userId) throw new Error("Failed to decode user identity from token.");

    const profilePayload = {
      firstName:   data.firstName   ?? "",
      lastName:    data.lastName    ?? "",
      email:       data.email       ?? "",
      phoneNumber: data.phoneNumber ?? "",
      avatarUrl:   data.avatarUrl   ?? "",
    };

    // Use AuthService instead of duplicating api.post("/auth/api/create-profile")
    await AuthService.createProfile(profilePayload as any);

    return { userId, ...profilePayload };
  }

  static getAllUsers() {
    return api.get<ApiResponse<UserResponseDto[]>>("/user/api/users/all");
  }
}
