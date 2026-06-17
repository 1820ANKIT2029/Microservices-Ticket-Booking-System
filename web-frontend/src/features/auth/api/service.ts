import { api } from "@/shared/api";
import type { ApiResponse } from "@/shared/types";
import type { LoginPayload, LoginResponse, SignupPayload, ProfileCreationRequest } from "../types";
import { TOKEN_KEY } from "@/shared/constants";

/**
 * AuthService — all HTTP calls for authentication.
 *
 * Token storage is intentionally NOT done here — that is the responsibility
 * of the auth store (useAuthStore.login()) to keep side-effects in one place.
 */
export class AuthService {
  /**
   * Authenticates the user. Returns the raw LoginResponse including the JWT.
   * The caller (mutation hook) is responsible for calling useAuthStore.login().
   */
  static async login(data: LoginPayload): Promise<LoginResponse> {
    const response     = await api.post<ApiResponse<LoginResponse>>("/auth/login", data);
    const loginResponse = response.data.data;

    // Store token for the axios interceptor — store update is done by the hook
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
