"use client";

import * as React from "react";
import { Footer } from "@/features/homepage/components/footer";
import { MobileBottomNav } from "@/features/homepage/components/mobile-bottom-nav";
import { SearchClient } from "@/features/search/components/search-client";
import { MOCK_SEARCH_EVENTS } from "@/features/search/constants/search-data";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = React.use(searchParams);
  const initialQuery = resolvedParams?.q || "";

  return (
    <>
      <main id="main-content" className="pt-20 pb-20 md:pb-0 min-h-screen bg-background">
        <SearchClient 
          key={initialQuery}
          initialEvents={MOCK_SEARCH_EVENTS}
          initialQuery={initialQuery}
        />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
