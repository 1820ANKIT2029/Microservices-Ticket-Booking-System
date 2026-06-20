"use client";

import * as React from "react";
import { Footer, MobileBottomNav } from "@/shared/components";
import { ProfileClient } from "@/features/users";

export default function ProfilePage() {
  return (
    <>
      {/* Main Container */}
      <div className="pt-16 pb-20 md:pb-0 min-h-screen bg-background flex flex-col">
        <React.Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="text-on-surface-variant font-semibold animate-pulse">
                Loading profile settings...
              </div>
            </div>
          }
        >
          <ProfileClient />
        </React.Suspense>
      </div>

      {/* Footer and Mobile Nav */}
      <Footer />
      <MobileBottomNav />
    </>
  );
}
