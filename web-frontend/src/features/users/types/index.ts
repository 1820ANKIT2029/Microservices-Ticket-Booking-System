import type { ISODateString } from "@/shared/types";
import type { UserRole } from "@/shared/constants";

// ── API DTOs (backend shapes — never expose to components) ────────────────────

export interface UserResponseDto {
  userId:      string;
  firstName:   string;
  lastName:    string;
  email:       string;
  phoneNumber: string;
  avatarUrl:   string;
  role?:       UserRole;
}

export interface UserRequestDto {
  firstName:   string;
  lastName:    string;
  email:       string;
  phoneNumber?: string;
  avatarUrl?:  string;
  role?:       UserRole;
}

// ── Domain Model (what components consume) ────────────────────────────────────

export interface User {
  id:        string;
  firstName: string;
  lastName:  string;
  fullName:  string;   // computed: `${firstName} ${lastName}`
  email:     string;
  phoneNumber: string;
  avatarUrl: string;
  role:      UserRole;
}

/**
 * @deprecated Use `User` domain model instead.
 * Kept for backward compatibility with profile components during migration.
 */
export interface UserProfileData {
  userId?:     string;
  firstName:   string;
  lastName:    string;
  email:       string;
  phoneNumber: string;
  avatarUrl:   string;
}

// ── Supporting types ──────────────────────────────────────────────────────────

export interface SecuritySettings {
  twoFactorEnabled:   boolean;
  passwordLastChanged: ISODateString;
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled:   boolean;
  pushEnabled:  boolean;
}

export interface SavedCard {
  id:        string;
  brand:     "visa" | "mastercard" | "amex";
  last4:     string;
  expDate:   string;
  isDefault: boolean;
}
