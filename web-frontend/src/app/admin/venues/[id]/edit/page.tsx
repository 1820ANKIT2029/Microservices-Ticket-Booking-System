"use client";

import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAdminVenue } from "@/features/admin";
import { VenueForm } from "@/features/admin/components/venues/VenueForm";
import { PageHeader } from "@/features/admin/components/common/PageHeader";
import { LoadingSpinner } from "@/features/admin/components/common/LoadingSpinner";
import { RoleGuard } from "@/shared/components/role-guard";

export default function EditVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: venue, isLoading, error } = useAdminVenue(Number(id));

  return (
    <RoleGuard requiredRole="ADMIN" redirectTo="/">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <PageHeader
          title="Edit Venue"
          subtitle={venue ? `Editing ${venue.name}` : "Loading venue details..."}
        />

        {isLoading && <LoadingSpinner message="Loading venue details..." />}
        
        {error && (
          <div className="p-4 bg-error-container text-on-error-container rounded-lg font-semibold border border-error/20">
            Failed to load venue details. Please try again.
          </div>
        )}

        {venue && <VenueForm initialData={venue} />}
      </div>
    </RoleGuard>
  );
}
