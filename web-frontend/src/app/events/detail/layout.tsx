import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Details | EventPass",
  description: "View event details, sessions, and book your tickets on EventPass.",
};

export default function EventDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
