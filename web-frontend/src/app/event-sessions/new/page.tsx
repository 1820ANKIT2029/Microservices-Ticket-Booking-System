"use client";

import React from "react";
import { EventSessionForm } from "@/features/event-sessions/components/EventSessionForm";
import { PageHeader } from "@/features/admin/components/common/PageHeader";
import { RoleGuard } from "@/shared/components/role-guard";

export default function NewEventSessionPage() {
  return (
    <RoleGuard requiredRole="ORGANIZER" redirectTo="/">
      <div className="max-w-4xl mx-auto p-4 pt-20 md:p-8 md:pt-24">
        <PageHeader
          title="Create Session"
          subtitle="Schedule a new session for an event"
        />
        <div className="mt-8">
          <EventSessionForm />
        </div>
      </div>
    </RoleGuard>
  );
}
