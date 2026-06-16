"use client";

import React, { use } from "react";
import { useSession } from "@/features/event-sessions/hooks/queries/useSession";
import { EventSessionForm } from "@/features/event-sessions/components/EventSessionForm";
import { PageHeader } from "@/features/admin/components/common/PageHeader";
import { LoadingSpinner } from "@/features/admin/components/common/LoadingSpinner";
import { RoleGuard } from "@/shared/components/role-guard";

export default function EditEventSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session, isLoading, error } = useSession(id);

  return (
    <RoleGuard requiredRole="ORGANIZER" redirectTo="/">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <PageHeader
          title="Edit Session"
          subtitle={session ? `Editing ${session.title}` : "Loading session details..."}
        />

        {isLoading && <LoadingSpinner message="Loading session details..." />}
        
        {error && (
          <div className="p-4 bg-error-container text-on-error-container rounded-lg font-semibold border border-error/20">
            Failed to load session details. Please try again.
          </div>
        )}

        {session && <EventSessionForm initialData={session} />}
      </div>
    </RoleGuard>
  );
}
