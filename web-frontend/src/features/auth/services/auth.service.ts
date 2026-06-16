"use client";

import { api } from "@/shared/api";
import { ApiResponse } from "@/shared/types/api-response";
import { LoginPayload, LoginResponse, SignupPayload, ProfileCreationRequest } from "../types/auth";

export const AuthService = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", data);
    const loginResponse = response.data.data;
    if (loginResponse.token) {
      localStorage.setItem("token", loginResponse.token);
    }
    return loginResponse;
  },

  logout: async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },

  signup: async (data: SignupPayload) => {
    const response = await api.post<ApiResponse<string>>("/auth/signup", data);
    return response.data?.data ?? response.data;
  },

  createProfile: async (data: ProfileCreationRequest) => {
    const response = await api.post<ApiResponse<string>>("/auth/create-profile", data);
    return response.data?.data ?? response.data;
  },
};

