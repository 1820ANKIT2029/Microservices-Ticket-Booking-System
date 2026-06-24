"use client";

import React, { useState } from "react";
import { useAdminEvents } from "@/features/events";
import { EventTable } from "@/features/events/components/EventTable";
import { PageHeader, LoadingSpinner, RoleGuard } from "@/shared/components";
import { Pagination } from "@/shared/components";

export default function EventsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useAdminEvents(page, 10);

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

        {!isLoading && !error && data && (
          <>
            <EventTable events={data.content || []} />
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

