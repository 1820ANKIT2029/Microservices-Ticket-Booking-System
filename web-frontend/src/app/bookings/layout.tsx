import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Bookings | EventPass",
  description: "Manage your upcoming events and view past ticket history with EventPass.",
};

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
