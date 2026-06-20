import { UserProfileData, SecuritySettings, NotificationPreferences, SavedCard } from "@/features/users/types/profile";

export const MOCK_USER_PROFILE: UserProfileData = {
  firstName: "Alex",
  lastName: "Rivers",
  email: "alex.rivers@example.com",
  phoneNumber: "+1 (555) 000-0000",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ9irQCuXUB3fs_eKOV5N3aMngIYHnUhuOctEOWH443-hb1Oy165ZlBGkgv6oXhAh9_WodBM6kNvRrjwb2L1KfNejBTFjSKjFrpAEEtND59ZxHmhiv2sZ8Eifa4B-IueDWLT6jxBU0ACWz_ELLYIISWssl1eMuZ3hCCbMBn9CwLd23AkRWCt3y3dhRnpD0MEBl9Rj1rrpU5p9PYkxWNgPaVNPZ8fbv7efSS_cFkQIJUmgJBkLAXk-4MaVFlUyTQdqGHN2h8sYCk5_g"
};

export const MOCK_SECURITY_SETTINGS: SecuritySettings = {
  twoFactorEnabled: true,
  passwordLastChanged: "3 months ago"
};

export const MOCK_NOTIFICATION_PREFS: NotificationPreferences = {
  emailEnabled: true,
  smsEnabled: false,
  pushEnabled: true
};

export const MOCK_SAVED_CARDS: SavedCard[] = [
  {
    id: "card-1",
    brand: "visa",
    last4: "4242",
    expDate: "12/28",
    isDefault: true
  },
  {
    id: "card-2",
    brand: "mastercard",
    last4: "5555",
    expDate: "09/27",
    isDefault: false
  }
];

export const MOCK_LOYALTY_STATUS = {
  tier: "Gold Member",
  pointsUntilNext: "1,240 points until Platinum"
};

export const MOCK_ACTIVE_TICKETS = {
  count: 3,
  description: "3 Upcoming Events"
};
