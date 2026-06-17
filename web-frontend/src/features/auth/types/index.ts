import type { UserRole } from "@/shared/constants";

// ── Request types ─────────────────────────────────────────────────────────────

export interface SignupPayload {
  email:       string;
  password:    string;
  firstName:   string;
  lastName:    string;
  phoneNumber: string;
  role:        UserRole;
}

export interface LoginPayload {
  email:    string;
  password: string;
}

export interface ProfileCreationRequest {
  firstName:   string;
  lastName:    string;
  email:       string;
  phoneNumber: string;
  avatarUrl:   string;
}

// ── Response types ────────────────────────────────────────────────────────────

export interface LoginResponse {
  token:      string;
  firstLogin: boolean;
}
