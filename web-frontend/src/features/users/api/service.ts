import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import type { UserResponseDto, UserRequestDto, UserProfileData } from "../types";
import { rawDtoToProfileData } from "../mapper";
import { getUserIdFromToken } from "@/shared/utils";
import { TOKEN_KEY } from "@/shared/constants";

/**
 * UserService — all HTTP calls for the users domain.
 * No business logic, no mapping beyond what's needed to call the API.
 * Mapping (DTO → domain model) is done in hooks via mapper.ts.
 */
export class UserService {
  /**
   * Fetches the authenticated user's raw DTO from the backend.
   */
  static getUser() {
    return api.get<ApiResponse<UserResponseDto>>("/user/api/users");
  }

  /**
   * Creates a new user record.
   */
  static createUser(data: UserRequestDto) {
    return api.post<ApiResponse<UserResponseDto>>("/user/api/users", data);
  }

  /**
   * Fetches and normalises the authenticated user's profile.
   * Returns UserProfileData for backward compatibility with legacy components.
   * New code should use getUser() + toUser() mapper directly.
   *
   * @deprecated Use getUser() + toUser() instead.
   */
  static async getProfile(): Promise<UserProfileData> {
    const response  = await UserService.getUser();
    const userDto   = response.data;

    if (!userDto) {
      throw new Error("Invalid profile response from server");
    }

    return rawDtoToProfileData(userDto as unknown as Record<string, unknown>);
  }

  /**
   * Updates the authenticated user's profile via the auth service upsert endpoint.
   *
   * @deprecated Use updateUser() when the backend provides a proper PUT/PATCH endpoint.
   */
  static async updateProfile(data: Partial<UserProfileData>): Promise<UserProfileData> {
    const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (!token) throw new Error("No authorization token found.");

    const userId = getUserIdFromToken(token);
    if (!userId) throw new Error("Failed to decode user identity from token.");

    const profilePayload = {
      firstName:   data.firstName   ?? "",
      lastName:    data.lastName    ?? "",
      email:       data.email       ?? "",
      phoneNumber: data.phoneNumber ?? "",
      avatarUrl:   data.avatarUrl   ?? "",
    };

    await api.post<ApiResponse<string>>("/auth/create-profile", profilePayload);

    return { userId, ...profilePayload };
  }

  /**
   * Fetches all users (admin only).
   */
  static getAllUsers() {
    return api.get<ApiResponse<UserResponseDto[]>>("/user/api/users/all");
  }
}
