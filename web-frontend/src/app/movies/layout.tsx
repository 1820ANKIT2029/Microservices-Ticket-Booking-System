import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movies | EventPass",
  description: "Explore trending, recommended, and upcoming movies in your city with IMAX, 3D, and standard showtimes on EventPass.",
};

export default function MoviesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
