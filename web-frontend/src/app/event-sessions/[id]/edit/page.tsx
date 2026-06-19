"use client";

import React, { use, Suspense } from "react";
import { useSession } from "@/features/event-sessions";
import { EventSessionForm } from "@/features/event-sessions/components/EventSessionForm";
import { PageHeader } from "@/features/admin/components/common/PageHeader";
import { LoadingSpinner } from "@/features/admin/components/common/LoadingSpinner";
import { RoleGuard } from "@/shared/components/role-guard";
import { useSearchParams } from "next/navigation";

function EditSessionContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId") || 0;
  
  const { data: session, isLoading, error } = useSession(eventId, id);

  return (
    <div className="max-w-4xl mx-auto p-4 pt-20 md:p-8 md:pt-24">
      <PageHeader
        title="Edit Session"
        subtitle={session ? `Editing ${session.title}` : "Loading session details..."}
      />

      {isLoading && <LoadingSpinner message="Loading session details..." />}
      
      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-lg font-semibold border border-error/20">
          Failed to load session details. Missing event ID or session not found.
        </div>
      )}

      {session && <EventSessionForm initialData={session} eventId={eventId} />}
    </div>
  );
}

export default function EditEventSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  return (
    <RoleGuard requiredRole="ORGANIZER" redirectTo="/">
      <Suspense fallback={<LoadingSpinner message="Loading..." />}>
        <EditSessionContent id={id} />
      </Suspense>
    </RoleGuard>
  );
}
