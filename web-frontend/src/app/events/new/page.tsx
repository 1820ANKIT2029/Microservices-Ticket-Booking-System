"use client";

import React from "react";
import { PageHeader, RoleGuard } from "@/shared/components";
import { EventSetupWizard } from "@/features/events/components/EventSetupWizard";

export default function CreateEventPage() {
  return (
    <RoleGuard requiredRole="ORGANIZER" redirectTo="/">
      <div className="max-w-5xl mx-auto p-4 pt-20 md:p-8 md:pt-24 space-y-6">
        <PageHeader
          title="Create New Event"
          subtitle="Set up your event details, tickets, and performers"
        />
        <EventSetupWizard />
      </div>
    </RoleGuard>
  );
}
