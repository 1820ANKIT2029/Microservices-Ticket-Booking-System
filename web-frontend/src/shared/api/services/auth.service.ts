import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import type { LoginPayload, LoginResponse, SignupPayload, ProfileCreationRequest } from "@/features/auth/types";
import { TOKEN_KEY } from "@/shared/constants";

/**
 * AuthService — all HTTP calls for authentication.
 */
export class AuthService {

  static async login(data: LoginPayload): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", data);
    const loginResponse = response.data.data;

    if (loginResponse.token && typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, loginResponse.token);
    }

    return loginResponse;
  }

  static async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  static async signup(data: SignupPayload): Promise<string> {
    const response = await api.post<ApiResponse<string>>("/auth/signup", data);
    return response.data?.data ?? (response.data as unknown as string);
  }

  static async createProfile(data: ProfileCreationRequest): Promise<string> {
    const response = await api.post<ApiResponse<string>>("/auth/create-profile", data);
    return response.data?.data ?? (response.data as unknown as string);
  }
}
