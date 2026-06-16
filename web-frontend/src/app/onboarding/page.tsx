"use client";

import { Suspense } from "react";
import { OnboardingClient } from "@/features/onboarding/components/onboarding-client";

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background text-on-background flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-secondary">Loading Profile Setup...</p>
        </div>
      </div>
    }>
      <OnboardingClient />
    </Suspense>
  );
}
