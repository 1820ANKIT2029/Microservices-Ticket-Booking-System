import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seat Selection | EventPass",
  description: "Interactive seat selection layout for EventPass.",
};

export default function SeatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
