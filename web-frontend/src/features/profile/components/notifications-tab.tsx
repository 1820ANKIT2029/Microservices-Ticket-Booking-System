"use client";

import * as React from "react";
import { Mail, MessageSquare, Smartphone, BellRing } from "lucide-react";
import { NotificationPreferences } from "@/features/users/types/profile";
import { Button } from "@/shared/components/ui/button";

interface NotificationsTabProps {
  initialData: NotificationPreferences;
  onSave: (data: NotificationPreferences) => Promise<void>;
}

export function NotificationsTab({ initialData, onSave }: NotificationsTabProps) {
  const [preferences, setPreferences] = React.useState<NotificationPreferences>(initialData);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saved">("idle");
  const [error, setError] = React.useState<string | null>(null);

  const handleToggle = (key: keyof NotificationPreferences, checked: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: checked }));
  };

  const handleDiscard = () => {
    setPreferences(initialData);
    setError(null);
    setSaveStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      await onSave(preferences);
      setSaveStatus("saved");
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch {
      setError("Failed to save notification preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <header className="mb-6">
        <h1 className="text-headline-md font-bold text-on-background mb-1">
          Notification Preferences
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Control how and when you receive updates about your bookings and upcoming events.
        </p>
      </header>

      {error && (
        <div
          className="p-4 bg-error-container text-on-error-container rounded-lg text-sm font-semibold border border-error/15"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <BellRing className="size-5 text-primary" />
          <h2 className="text-headline-sm font-bold text-on-surface">Communication Channels</h2>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden divide-y divide-outline-variant/20">
          {/* Email Notifications */}
          <div className="p-6 flex items-center justify-between hover:bg-surface-container-low/30 transition-colors gap-6">
            <div className="flex gap-4 items-center">
              <div className="p-2.5 bg-surface-container rounded-xl text-on-surface-variant shrink-0">
                <Mail className="size-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-label-md text-on-surface">Email Notifications</p>
                <p className="text-sm text-on-surface-variant">
                  Receive event updates and ticket confirmations via email.
                </p>
              </div>
            </div>
            {/* Custom toggle */}
            <div className="relative inline-block w-10 align-middle select-none shrink-0">
              <input
                type="checkbox"
                id="email-notif"
                className="peer absolute block w-5 h-5 rounded-full bg-white border-2 border-outline-variant appearance-none cursor-pointer transition-all duration-300 right-5 checked:right-0 checked:border-primary checked:translate-x-0"
                checked={preferences.emailEnabled}
                onChange={(e) => handleToggle("emailEnabled", e.target.checked)}
                disabled={isSaving}
                aria-label="Toggle Email Notifications"
              />
              <label
                className="block overflow-hidden h-5 rounded-full bg-outline-variant cursor-pointer transition-colors duration-300 peer-checked:bg-primary"
                htmlFor="email-notif"
              />
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="p-6 flex items-center justify-between hover:bg-surface-container-low/30 transition-colors gap-6">
            <div className="flex gap-4 items-center">
              <div className="p-2.5 bg-surface-container rounded-xl text-on-surface-variant shrink-0">
                <MessageSquare className="size-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-label-md text-on-surface">SMS Alerts</p>
                <p className="text-sm text-on-surface-variant">
                  Get urgent updates about your events on your mobile phone.
                </p>
              </div>
            </div>
            {/* Custom toggle */}
            <div className="relative inline-block w-10 align-middle select-none shrink-0">
              <input
                type="checkbox"
                id="sms-notif"
                className="peer absolute block w-5 h-5 rounded-full bg-white border-2 border-outline-variant appearance-none cursor-pointer transition-all duration-300 right-5 checked:right-0 checked:border-primary checked:translate-x-0"
                checked={preferences.smsEnabled}
                onChange={(e) => handleToggle("smsEnabled", e.target.checked)}
                disabled={isSaving}
                aria-label="Toggle SMS Alerts"
              />
              <label
                className="block overflow-hidden h-5 rounded-full bg-outline-variant cursor-pointer transition-colors duration-300 peer-checked:bg-primary"
                htmlFor="sms-notif"
              />
            </div>
          </div>

          {/* Push Notifications */}
          <div className="p-6 flex items-center justify-between hover:bg-surface-container-low/30 transition-colors gap-6">
            <div className="flex gap-4 items-center">
              <div className="p-2.5 bg-surface-container rounded-xl text-on-surface-variant shrink-0">
                <Smartphone className="size-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-label-md text-on-surface">Push Notifications</p>
                <p className="text-sm text-on-surface-variant">
                  Real-time alerts for ticket sales and personalized recommendations.
                </p>
              </div>
            </div>
            {/* Custom toggle */}
            <div className="relative inline-block w-10 align-middle select-none shrink-0">
              <input
                type="checkbox"
                id="push-notif"
                className="peer absolute block w-5 h-5 rounded-full bg-white border-2 border-outline-variant appearance-none cursor-pointer transition-all duration-300 right-5 checked:right-0 checked:border-primary checked:translate-x-0"
                checked={preferences.pushEnabled}
                onChange={(e) => handleToggle("pushEnabled", e.target.checked)}
                disabled={isSaving}
                aria-label="Toggle Push Notifications"
              />
              <label
                className="block overflow-hidden h-5 rounded-full bg-outline-variant cursor-pointer transition-colors duration-300 peer-checked:bg-primary"
                htmlFor="push-notif"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-outline-variant/30 flex justify-end gap-4">
          <button
            onClick={handleDiscard}
            type="button"
            className="px-6 py-3 font-semibold text-label-md text-on-surface-variant hover:bg-surface-container-highest/60 rounded-lg transition-colors cursor-pointer border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            disabled={isSaving}
          >
            Discard
          </button>
          <Button
            type="submit"
            className={`px-8 py-3 text-label-md font-semibold rounded-lg shadow-sm active:scale-95 transition-all cursor-pointer border-none flex items-center justify-center ${
              saveStatus === "saved"
                ? "bg-green-600 hover:bg-green-600 text-white"
                : "bg-primary text-on-primary hover:opacity-90"
            }`}
            disabled={isSaving}
          >
            {isSaving ? "Saving Preferences..." : saveStatus === "saved" ? "Preferences Saved!" : "Save Preferences"}
          </Button>
        </div>
      </form>
    </div>
  );
}
