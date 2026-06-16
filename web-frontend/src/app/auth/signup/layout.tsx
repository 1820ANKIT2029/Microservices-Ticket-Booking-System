import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | EventPass",
  description: "Create your EventPass account to access exclusive live events, concerts, and stadium shows.",
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
