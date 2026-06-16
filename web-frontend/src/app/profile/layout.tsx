import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile & Settings | EventPass",
  description: "Manage your EventPass profile, personal details, notifications, and security settings.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
