"use client";

import { Ticket } from "lucide-react";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { SignInForm } from "@/features/auth/components/signin-form";

export default function SignInPage() {
  return (
    <AuthLayout
      heroImage="https://lh3.googleusercontent.com/aida-public/AB6AXuCjoNkUO5pEMH2aFOc5rgYz9wliCFVH8mstDOGXLwWsN_8AVUWBpJNHYg0Q36BU34Hv5nYzSBwTQWr01-cwBen13CbWF0jJT-wXSNY1XHf6KvHCdgfwaPPYnyqM2wdi7AGpTF6iGNeKd0omJde1JaLsvmszoZR8OSvYvNWZ_xwHSEhQ5I9RU1n-sTju1biC1l5WQn6lN9iCAp8nvycpwXWxrGd2Ddu0JHBvr3OS23sCHcc8ppCbl_HQFp8nKLYMPdWBywlPF9gaKSxQ"
      heroTitle="Welcome Back! Ready for your next experience?"
      heroDescription="Access your personalized dashboard, manage your tickets, and discover the hottest events happening near you."
      badgeText="Official EventPass Portal"
      badgeIcon={<Ticket className="size-4" />}
    >
      <SignInForm />
    </AuthLayout>
  );
}
