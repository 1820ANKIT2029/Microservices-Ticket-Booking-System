"use client";

import React from "react";
import { useSessions } from "@/features/event-sessions";
import { EventSessionTable } from "@/features/event-sessions/components/EventSessionTable";
import { PageHeader, LoadingSpinner, RoleGuard } from "@/shared/components";

export default function EventSessionsPage() {
  const { data, isLoading, error } = useSessions();

  return (
    <RoleGuard requiredRole="ORGANIZER" redirectTo="/">
      <div className="max-w-7xl mx-auto p-4 pt-20 md:p-8 md:pt-24">
        <PageHeader
          title="Event Sessions"
          subtitle="Manage dates, times, and capacities for events"
          actionLabel="Create Session"
          actionHref="/event-sessions/new"
        />

        {isLoading && <LoadingSpinner message="Loading sessions..." />}
        
        {error && (
          <div className="p-4 bg-error-container text-on-error-container rounded-lg font-semibold border border-error/20">
            Failed to load sessions. Please try again.
          </div>
        )}

        {data && <EventSessionTable sessions={data} />}
      </div>
    </RoleGuard>
  );
}
