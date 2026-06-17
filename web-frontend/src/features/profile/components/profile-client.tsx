"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ProfileSidebar, ProfileTab } from "./profile-sidebar";
import { PersonalInfoTab } from "./personal-info-tab";
import { SecurityTab } from "./security-tab";
import { NotificationsTab } from "./notifications-tab";
import { PaymentsTab } from "./payments-tab";
import { BookingsTab } from "./bookings-tab";
import {
  MOCK_SECURITY_SETTINGS,
  MOCK_NOTIFICATION_PREFS,
  MOCK_SAVED_CARDS,
} from "../constants/profile-data";
import { SecuritySettings, NotificationPreferences } from "@/features/users/types/profile";
import { useUser, useUpdateProfile } from "@/features/users";
import { UserProfileData } from "@/features/users/types/profile";

export function ProfileClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as ProfileTab) || "personal";

  // ── Server state via React Query (single source of truth) ─────────────────
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useUser();
  const updateProfileMutation = useUpdateProfile();

  // ── Local UI-only state (not server data) ──────────────────────────────────
  const [security, setSecurity] = React.useState<SecuritySettings>(MOCK_SECURITY_SETTINGS);
  const [notifications, setNotifications] = React.useState<NotificationPreferences>(MOCK_NOTIFICATION_PREFS);

  // Authentication guard
  React.useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) router.push("/auth/signin");
  }, [router]);

  // Sync auth store with profile data from React Query
  React.useEffect(() => {
    if (profile) {
      const { useAuthStore } = require("@/shared/store/auth.store");
      useAuthStore.getState().setUser(profile);
    }
  }, [profile]);

  const handleTabChange = (tab: ProfileTab) => {
    router.replace(`/profile?tab=${tab}`);
  };

  // Profile save: goes through the mutation, which invalidates the RQ cache automatically
  const handleProfileSave = async (updatedData: UserProfileData) => {
    await updateProfileMutation.mutateAsync(updatedData);
  };

  const handleSecuritySave = async (updatedData: SecuritySettings) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSecurity(updatedData);
  };

  const handleNotificationsSave = async (updatedData: NotificationPreferences) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setNotifications(updatedData);
  };

  const renderActiveTabContent = () => {
    // Use React Query cached profile with fallback to empty defaults
    const profileData: UserProfileData = profile ?? {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "555-0100",
      avatarUrl: "",
    };

    switch (activeTab) {
      case "personal":
        return <PersonalInfoTab initialData={profileData} onSave={handleProfileSave} />;
      case "bookings":
        return <BookingsTab />;
      case "security":
        return <SecurityTab initialData={security} onSave={handleSecuritySave} />;
      case "notifications":
        return <NotificationsTab initialData={notifications} onSave={handleNotificationsSave} />;
      case "payments":
        return <PaymentsTab initialCards={MOCK_SAVED_CARDS} />;

      // ── Organizer tabs ──────────────────────────────────────────────────────────
      case "admin-venues":
        return (
          <div className="space-y-4">
            <h2 className="text-headline-sm font-bold">Venues Manager</h2>
            <p className="text-sm text-muted-foreground">Manage physical venue locations and capacities.</p>
            <div className="flex gap-4">
              <a
                href="/admin/venues"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Open Venues →
              </a>
            </div>
          </div>
        );

      case "admin-events":
        return (
          <div className="space-y-4">
            <h2 className="text-headline-sm font-bold">Event Manager</h2>
            <p className="text-sm text-muted-foreground">Create and manage events and shows.</p>
            <a
              href="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Open Events →
            </a>
          </div>
        );

      case "admin-sessions":
        return (
          <div className="space-y-4">
            <h2 className="text-headline-sm font-bold">Event Sessions</h2>
            <p className="text-sm text-muted-foreground">Schedule event dates, times, and manage status.</p>
            <a
              href="/event-sessions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Open Sessions →
            </a>
          </div>
        );

      // ── Admin tabs ─────────────────────────────────────────────────────
      case "admin-users":
        return (
          <div className="space-y-4">
            <h2 className="text-headline-sm font-bold">User Management</h2>
            <p className="text-sm text-muted-foreground">Manage all users and their roles. (Coming soon)</p>
          </div>
        );

      case "admin-settings":
        return (
          <div className="space-y-4">
            <h2 className="text-headline-sm font-bold">System Settings</h2>
            <p className="text-sm text-muted-foreground">Global platform settings. (Coming soon)</p>
          </div>
        );

      default:
        return <PersonalInfoTab initialData={profileData} onSave={handleProfileSave} />;
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[500px]">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant font-semibold">Loading profile details...</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[500px] text-center">
        <div className="p-4 bg-error-container text-on-error-container rounded-lg text-sm font-semibold border border-error/20 mb-4 max-w-md mx-auto">
          {profileError instanceof Error ? profileError.message : "Failed to load profile from the backend server."}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-primary text-on-primary text-label-md font-semibold rounded-lg hover:opacity-90 transition-all cursor-pointer border-none"
        >
          Retry
        </button>
      </div>
    );
  }

  const userFullName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : "";

  return (
    <div className="flex flex-col md:flex-row flex-1 max-w-7xl mx-auto w-full relative">
      <ProfileSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userEmail={profile?.email ?? ""}
        userFullName={userFullName}
        userAvatar={profile?.avatarUrl ?? ""}
      />

      <main className="flex-1 bg-surface-container-lowest px-4 sm:px-6 md:px-12 py-8 md:py-12 min-h-[calc(100vh-64px)] border-l border-outline-variant/10">
        <div className="max-w-3xl w-full">
          {renderActiveTabContent()}
        </div>
      </main>
    </div>
  );
}
