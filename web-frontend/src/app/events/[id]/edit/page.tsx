"use client";

import React, { use } from "react";
import { useAdminEvent } from "@/features/events/hooks/queries/useAdminEvent";
import { EventForm } from "@/features/events/components/EventForm";
import { PageHeader } from "@/features/admin/components/common/PageHeader";
import { LoadingSpinner } from "@/features/admin/components/common/LoadingSpinner";
import { RoleGuard } from "@/shared/components/role-guard";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: event, isLoading, error } = useAdminEvent(id);

  return (
    <RoleGuard requiredRole="ORGANIZER" redirectTo="/">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <PageHeader
          title="Edit Event"
          subtitle={event ? `Editing ${event.title}` : "Loading event details..."}
        />

        {isLoading && <LoadingSpinner message="Loading event details..." />}
        
        {error && (
          <div className="p-4 bg-error-container text-on-error-container rounded-lg font-semibold border border-error/20">
            Failed to load event details. Please try again.
          </div>
        )}

        {event && <EventForm initialData={event} />}
      </div>
    </RoleGuard>
  );
}
