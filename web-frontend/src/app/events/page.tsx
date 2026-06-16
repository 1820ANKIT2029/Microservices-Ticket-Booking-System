"use client";

import React from "react";
import { useAdminEvents } from "@/features/events/hooks/queries/useAdminEvents";
import { EventTable } from "@/features/events/components/EventTable";
import { PageHeader } from "@/features/admin/components/common/PageHeader";
import { LoadingSpinner } from "@/features/admin/components/common/LoadingSpinner";
import { RoleGuard } from "@/shared/components/role-guard";

export default function EventsPage() {
  const { data, isLoading, error } = useAdminEvents();

  return (
    <RoleGuard requiredRole="ORGANIZER" redirectTo="/">
      <div className="max-w-7xl mx-auto p-4 pt-20 md:p-8 md:pt-24">
        <PageHeader
          title="Events"
          subtitle="Manage your events and shows"
          actionLabel="Create Event"
          actionHref="/events/new"
        />

        {isLoading && <LoadingSpinner message="Loading events..." />}
        
        {error && (
          <div className="p-4 bg-error-container text-on-error-container rounded-lg font-semibold border border-error/20">
            Failed to load events. Please try again.
          </div>
        )}

        {data && <EventTable events={data} />}
      </div>
    </RoleGuard>
  );
}
