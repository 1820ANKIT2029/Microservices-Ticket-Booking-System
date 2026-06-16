"use client";

import { Sparkles } from "lucide-react";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { SignUpForm } from "@/features/auth/components/signup-form";

export default function SignUpPage() {
  return (
    <AuthLayout
      heroImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBnmUsdC_vWB-bWeDNglYBhzFn_v_oDPem0_9xuq-iz5rW0x9HNM9rPWqgkM1ltjQEhuwCSorGv93rdjCvK1Jl4j4jFcotRxq9huJPTrkMz3Y8wkuyWY8TIj-ueBLbuxo-4a3SIr0IOYVJJRgjBNf5tWorQQ_4tAwSNCAnmh9uWRY4GSsda8ZIUGZSjfiUCZv819G0ByqrwHhyytOrhQqnbu1DMp4pbcAlMCqbn54ChFFVw4FUQ0nT0z3a08C2WK3Nty2KXGGOw0gAI"
      heroTitle="Join EventPass. Your gateway to live experiences."
      heroDescription="Discover, book, and enjoy the most exclusive events in your city with our seamless digital ticketing platform."
      badgeText="EventPass Experience"
      badgeIcon={<Sparkles className="size-4" />}
    >
      <SignUpForm />
    </AuthLayout>
  );
}
