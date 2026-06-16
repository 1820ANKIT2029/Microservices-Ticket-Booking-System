"use client";

import React from "react";
import { EventSessionForm } from "@/features/event-sessions/components/EventSessionForm";
import { PageHeader } from "@/features/admin/components/common/PageHeader";
import { RoleGuard } from "@/shared/components/role-guard";

export default function CreateEventSessionPage() {
  return (
    <RoleGuard requiredRole="ORGANIZER" redirectTo="/">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <PageHeader
          title="Create Session"
          subtitle="Schedule a new session for an event"
        />
        <EventSessionForm />
      </div>
    </RoleGuard>
  );
}
