import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Results | EventPass",
  description: "Find and filter the best movies, sports events, concerts, and shows in your city with EventPass.",
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
