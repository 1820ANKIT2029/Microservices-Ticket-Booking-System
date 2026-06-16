"use client";

import { api } from "@/shared/api";
import { ApiResponse } from "@/shared/types/api-response";
import { UserProfileData, UserResponseDto, UserRequestDto } from "../types/profile";
import { getUserIdFromToken } from "@/shared/utils";

export const UserService = {
  getUser: () =>
    api.get<ApiResponse<UserResponseDto>>("/user/api/users"),

  createUser: (data: UserRequestDto) =>
    api.post<ApiResponse<UserResponseDto>>("/user/api/users", data),

  getProfile: async (): Promise<{ data: { data: UserProfileData; message?: string } }> => {
    const response = await UserService.getUser();
    const rawData = response.data;
    const userDto = (rawData && typeof rawData === "object" && "data" in rawData) 
      ? (rawData as any).data 
      : rawData;

    if (!userDto) {
      throw new Error("Invalid profile response from server");
    }

    // Map backend UserResponseDto to frontend UserProfileData, supporting both camelCase and snake_case
    const profile: UserProfileData = {
      userId: userDto.userId || userDto.user_id,
      firstName: userDto.firstName || userDto.first_name || "",
      lastName: userDto.lastName || userDto.last_name || "",
      email: userDto.email || "",
      phoneNumber: userDto.phoneNumber || userDto.phone_number || "",
      avatarUrl: userDto.avatarUrl || userDto.avatar_url || "",
    };

    return {
      data: {
        data: profile,
        message: (rawData as any)?.message || "",
      },
    };
  },

  updateProfile: async (data: Partial<UserProfileData>): Promise<{ data: { data: UserProfileData; message?: string } }> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      throw new Error("No authorization token found.");
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      throw new Error("Failed to decode user identity from token.");
    }

    // Call create-profile to upsert profile on backend
    const profilePayload = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      phoneNumber: data.phoneNumber || "",
      avatarUrl: data.avatarUrl || "",
    };

    const response = await api.post<ApiResponse<string>>("/auth/create-profile", profilePayload);

    const mappedProfile: UserProfileData = {
      userId,
      firstName: profilePayload.firstName,
      lastName: profilePayload.lastName,
      email: profilePayload.email,
      phoneNumber: profilePayload.phoneNumber,
      avatarUrl: profilePayload.avatarUrl,
    };

    return {
      data: {
        data: mappedProfile,
        message: response.data.message,
      },
    };
  },
};
