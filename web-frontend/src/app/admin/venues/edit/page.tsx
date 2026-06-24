"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAdminVenue, VenueForm } from "@/features/venue-seat-map";
import { PageHeader, LoadingSpinner, RoleGuard } from "@/shared/components";

function EditVenueContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { data: venue, isLoading, error } = useAdminVenue(Number(id));

  if (!id) {
    return (
      <div className="p-4 bg-error-container text-on-error-container rounded-lg font-semibold border border-error/20">
        Missing venue ID in URL.
      </div>
    );
  }

  return (
    <>
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
    </>
  );
}

export default function EditVenuePage() {
  return (
    <RoleGuard requiredRole="ADMIN" redirectTo="/">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <Suspense fallback={<LoadingSpinner message="Loading venue details..." />}>
          <EditVenueContent />
        </Suspense>
      </div>
    </RoleGuard>
  );
}
