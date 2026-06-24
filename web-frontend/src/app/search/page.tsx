"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Footer } from "@/features/homepage/components/footer";
import { MobileBottomNav } from "@/features/homepage/components/mobile-bottom-nav";
import { SearchClient } from "@/features/search/components/search-client";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  return (
    <>
      <main id="main-content" className="pt-20 pb-20 md:pb-0 min-h-screen bg-background">
        <SearchClient 
          key={initialQuery}
          initialQuery={initialQuery}
        />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

