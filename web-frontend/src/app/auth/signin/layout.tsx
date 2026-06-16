import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | EventPass",
  description: "Sign in to your EventPass account to manage tickets and explore events.",
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
