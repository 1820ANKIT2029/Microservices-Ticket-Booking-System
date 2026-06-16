import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Failed | EventPass",
  description: "Your EventPass ticket booking could not be completed.",
};

export default function FailedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
