import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout | EventPass",
  description: "Securely complete your EventPass ticket booking with bank-grade encryption.",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
