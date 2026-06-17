"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAdminVenues } from "@/features/admin";
import { VenueTable } from "@/features/admin/components/venues/VenueTable";
import { PageHeader } from "@/features/admin/components/common/PageHeader";
import { LoadingSpinner } from "@/features/admin/components/common/LoadingSpinner";
import { RoleGuard } from "@/shared/components/role-guard";
import { useRole } from "@/shared/hooks/useRole";

export default function VenuesPage() {
  const { isAdmin } = useRole();
  const { data: venues = [], isLoading, error } = useAdminVenues();

  return (
    <RoleGuard requiredRole="ADMIN" redirectTo="/">
      <div className="max-w-7xl mx-auto p-4 pt-20 md:p-8 md:pt-24">
        <PageHeader
          title="Venues"
          subtitle="Manage all venues and locations"
          actionLabel={isAdmin ? "Create Venue" : undefined}
          actionHref={isAdmin ? "/admin/venues/new" : undefined}
        />

        {isLoading && <LoadingSpinner message="Loading venues..." />}
        
        {error && (
          <div className="p-4 bg-error-container text-on-error-container rounded-lg font-semibold border border-error/20">
            Failed to load venues. Please try again.
          </div>
        )}

        {venues && <VenueTable venues={venues} />}
      </div>
    </RoleGuard>
  );
}
