import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sports Events | EventPass",
  description: "Discover live scores, local tournaments, and recommended matches near you. Book tickets for Cricket, Football, Tennis, Motorsports and more on EventPass.",
};

export default function SportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
