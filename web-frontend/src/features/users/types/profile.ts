export interface UserProfileData {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordLastChanged: string;
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
}

export interface SavedCard {
  id: string;
  brand: "visa" | "mastercard" | "amex";
  last4: string;
  expDate: string;
  isDefault: boolean;
}

export interface UserResponseDto {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
}

export interface UserRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role?: "CONSUMER" | "ORGANIZER" | "ADMIN";
}
