"use client";

import * as React from "react";
import { Shield, Eye, EyeOff, Lock } from "lucide-react";
import { SecuritySettings } from "@/features/users/types/profile";
import { Button } from "@/shared/components/ui/button";

interface SecurityTabProps {
  initialData: SecuritySettings;
  onSave: (data: SecuritySettings) => Promise<void>;
}

export function SecurityTab({ initialData, onSave }: SecurityTabProps) {
  const [securityData, setSecurityData] = React.useState<SecuritySettings>(initialData);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [showCurrentPass, setShowCurrentPass] = React.useState(false);
  const [showNewPass, setShowNewPass] = React.useState(false);
  const [showConfirmPass, setShowConfirmPass] = React.useState(false);

  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saved">("idle");
  const [error, setError] = React.useState<string | null>(null);

  const handle2FAToggle = (checked: boolean) => {
    setSecurityData((prev) => ({ ...prev, twoFactorEnabled: checked }));
  };

  const handleDiscard = () => {
    setSecurityData(initialData);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsChangingPassword(false);
    setError(null);
    setSaveStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isChangingPassword) {
      if (!currentPassword) {
        setError("Current password is required to make changes.");
        return;
      }
      if (newPassword.length < 8) {
        setError("New password must be at least 8 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("New password and confirmation password do not match.");
        return;
      }
    }

    setIsSaving(true);

    try {
      await onSave(securityData);
      setSaveStatus("saved");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch {
      setError("Failed to update security settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <header className="mb-6">
        <h1 className="text-headline-md font-bold text-on-background mb-1">
          Security Settings
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Manage your account security controls, credentials, and authentication methods.
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
        {/* Security Summary Section */}
        <div className="flex items-center gap-2 mb-4">
          <Shield className="size-5 text-primary" />
          <h2 className="text-headline-sm font-bold text-on-surface">Account Protection</h2>
        </div>

        {/* Change Password Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-2xl transition-all hover:border-primary/50">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-label-md text-on-surface">Password</h3>
              <p className="text-sm text-on-surface-variant">
                Last changed {securityData.passwordLastChanged}. Use a strong, unique password.
              </p>
            </div>
            {!isChangingPassword ? (
              <button
                type="button"
                onClick={() => setIsChangingPassword(true)}
                className="text-primary font-bold text-label-md hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1"
              >
                Change
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="text-on-surface-variant font-bold text-label-md hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1"
              >
                Cancel
              </button>
            )}
          </div>

          {isChangingPassword && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-outline-variant/30 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant" htmlFor="current-password">
                  CURRENT PASSWORD
                </label>
                <div className="relative group">
                  <input
                    className="w-full bg-surface border border-outline-variant/80 rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-body-md text-on-surface"
                    id="current-password"
                    type={showCurrentPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant" htmlFor="new-password">
                  NEW PASSWORD
                </label>
                <div className="relative group">
                  <input
                    className="w-full bg-surface border border-outline-variant/80 rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-body-md text-on-surface"
                    id="new-password"
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant" htmlFor="confirm-password">
                  CONFIRM NEW PASSWORD
                </label>
                <div className="relative group">
                  <input
                    className="w-full bg-surface border border-outline-variant/80 rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-body-md text-on-surface"
                    id="confirm-password"
                    type={showConfirmPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors cursor-pointer"
                  >
                    {showConfirmPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2FA Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-2xl flex items-center justify-between gap-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center text-primary shrink-0">
              <Lock className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-label-md text-on-surface">
                Two-Factor Authentication (2FA)
              </h3>
              <p className="text-sm text-on-surface-variant">
                Add an extra layer of security to your account via SMS or Authenticator App.
              </p>
            </div>
          </div>
          {/* Custom toggle switch */}
          <div className="relative inline-block w-12 align-middle select-none shrink-0">
            <input
              type="checkbox"
              id="toggle-2fa"
              className="peer absolute block w-6 h-6 rounded-full bg-white border-4 border-outline-variant appearance-none cursor-pointer transition-all duration-300 ease-in-out right-6 checked:right-0 checked:border-primary checked:translate-x-0"
              checked={securityData.twoFactorEnabled}
              onChange={(e) => handle2FAToggle(e.target.checked)}
              disabled={isSaving}
              aria-label="Toggle Two-Factor Authentication"
            />
            <label
              className="block overflow-hidden h-6 rounded-full bg-outline-variant cursor-pointer transition-colors duration-300 peer-checked:bg-primary"
              htmlFor="toggle-2fa"
            />
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
            {isSaving ? "Saving Settings..." : saveStatus === "saved" ? "Settings Saved!" : "Save Security"}
          </Button>
        </div>
      </form>
    </div>
  );
}
