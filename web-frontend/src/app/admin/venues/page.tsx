"use client";

import React, { useState, useEffect } from "react";
import { useAdminVenues, VenueTable } from "@/features/venue-seat-map";
import { PageHeader, LoadingSpinner, RoleGuard } from "@/shared/components";
import { useRole } from "@/shared/hooks/useRole";
import { useDebounce } from "@/shared/hooks";
import { Search } from "lucide-react";
import { Pagination } from "@/shared/components";

export default function VenuesPage() {
  const { isAdmin } = useRole();
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    setPage(0); // Reset page to 0 when search term changes
  }, [debouncedKeyword]);

  const { data, isLoading, error } = useAdminVenues(page, 10, debouncedKeyword);

  return (
    <RoleGuard requiredRole="ADMIN" redirectTo="/">
      <div className="max-w-7xl mx-auto p-4 pt-20 md:p-8 md:pt-24">
        <PageHeader
          title="Venues"
          subtitle="Manage all venues and locations"
          actionLabel={isAdmin ? "Create Venue" : undefined}
          actionHref={isAdmin ? "/admin/venues/new" : undefined}
        />

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search venues by name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant/60 rounded-lg py-2 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface"
            />
            <Search className="absolute left-3 top-2.5 text-on-surface-variant size-5" />
          </div>
        </div>

        {isLoading && <LoadingSpinner message="Loading venues..." />}
        
        {error && (
          <div className="p-4 bg-error-container text-on-error-container rounded-lg font-semibold border border-error/20">
            Failed to load venues. Please try again.
          </div>
        )}

        {!isLoading && !error && data && (
          <>
            <VenueTable venues={data.content || []} />
            {data.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={page + 1}
                  totalPages={data.totalPages}
                  onPageChange={(p: number) => setPage(p - 1)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </RoleGuard>
  );
}

