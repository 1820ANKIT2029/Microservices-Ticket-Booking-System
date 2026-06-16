import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music Concerts | EventPass",
  description: "Explore world tours, music festivals, and live concerts near you. Book tickets for Sunburn, Lollapalooza, and more on EventPass.",
};

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
