import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Confirmed | EventPass",
  description: "Your EventPass tickets have been confirmed successfully.",
};

export default function ConfirmedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
