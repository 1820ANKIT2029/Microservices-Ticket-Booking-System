import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to EventPass - Profile Setup",
  description: "Set up your profile photo, location, and interests on EventPass.",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
