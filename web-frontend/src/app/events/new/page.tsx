"use client";

import React from "react";
import { EventForm } from "@/features/events/components/EventForm";
import { PageHeader } from "@/features/admin/components/common/PageHeader";
import { RoleGuard } from "@/shared/components/role-guard";

export default function CreateEventPage() {
  return (
    <RoleGuard requiredRole="ORGANIZER" redirectTo="/">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <PageHeader
          title="Create Event"
          subtitle="Add a new event to your catalog"
        />
        <EventForm />
      </div>
    </RoleGuard>
  );
}
