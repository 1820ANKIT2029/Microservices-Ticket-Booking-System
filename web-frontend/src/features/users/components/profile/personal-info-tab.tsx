"use client";

import * as React from "react";
import Link from "next/link";
import { Camera, CheckCircle, Star, Ticket } from "lucide-react";
import { UserProfileData } from "@/features/users/types/profile";
import { MOCK_LOYALTY_STATUS, MOCK_ACTIVE_TICKETS } from "../../constants/profile-data";
import { Button } from "@/shared/components/ui/button";

interface PersonalInfoTabProps {
  initialData: UserProfileData;
  onSave: (data: UserProfileData) => Promise<void>;
}

export function PersonalInfoTab({ initialData, onSave }: PersonalInfoTabProps) {
  const [formData, setFormData] = React.useState<UserProfileData>(initialData);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saved">("idle");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const key = id.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) as keyof UserProfileData;
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({ ...prev, avatarUrl: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      avatarUrl: "",
    }));
  };

  const handleDiscard = () => {
    setFormData(initialData);
    setError(null);
    setSaveStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      await onSave(formData);
      setSaveStatus("saved");
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <header className="mb-6">
        <h1 className="text-headline-md font-bold text-on-background mb-1">
          Personal Information
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Manage your profile details and contact information for a seamless booking experience.
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

      {/* Profile Photo Upload Section */}
      <section className="bg-surface border border-outline-variant/30 p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-container/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                id="profile-preview"
                src={formData.avatarUrl || "https://placehold.net/avatar-5.png"}
                alt="Profile avatar preview"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={triggerFileSelect}
              type="button"
              className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
              aria-label="Upload new photo"
            >
              <Camera className="size-6" />
            </button>
            <input
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h2 className="text-headline-sm font-bold text-on-surface">Profile Photo</h2>
            <p className="text-label-sm text-on-surface-variant">
              PNG or JPG up to 5MB. Recommended size 400x400px.
            </p>
            <div className="flex justify-center sm:justify-start gap-3 pt-2">
              <button
                onClick={triggerFileSelect}
                type="button"
                className="px-4 py-2 bg-secondary-container hover:bg-outline-variant/30 text-on-secondary-container font-semibold text-label-md rounded-lg transition-colors cursor-pointer border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Change
              </button>
              <button
                onClick={handleRemovePhoto}
                type="button"
                className="px-4 py-2 border border-error hover:bg-error/5 text-error font-semibold text-label-md rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-label-md font-bold text-on-surface" htmlFor="first-name">
              First Name
            </label>
            <input
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/85 rounded-lg text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              id="first-name"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-label-md font-bold text-on-surface" htmlFor="last-name">
              Last Name
            </label>
            <input
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/85 rounded-lg text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              id="last-name"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-label-md font-bold text-on-surface" htmlFor="email">
              Email Address
            </label>
            <div className="relative group">
              <input
                className="w-full pl-4 pr-12 py-3 bg-surface-container-low border border-outline-variant/85 rounded-lg text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary flex items-center"
                title="Verified email address"
              >
                <CheckCircle className="size-5 fill-primary/10" />
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-label-md font-bold text-on-surface" htmlFor="phone-number">
              Phone Number
            </label>
            <input
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/85 rounded-lg text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              id="phone-number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-outline-variant/30 flex justify-end gap-4">
          <button
            onClick={handleDiscard}
            type="button"
            className="px-6 py-3 font-semibold text-label-md text-on-surface-variant hover:bg-surface-container-highest/60 rounded-lg transition-colors cursor-pointer border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            disabled={isSaving}
          >
            Discard Changes
          </button>
          <Button
            type="submit"
            className={`px-8 py-3 text-label-md font-semibold rounded-lg shadow-sm active:scale-95 transition-all cursor-pointer border-none flex items-center justify-center ${saveStatus === "saved"
                ? "bg-green-600 hover:bg-green-600 text-white"
                : "bg-primary text-on-primary hover:opacity-90"
              }`}
            disabled={isSaving}
          >
            {isSaving ? "Saving Profile..." : saveStatus === "saved" ? "Profile Saved!" : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
