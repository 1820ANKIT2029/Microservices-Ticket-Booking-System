"use client";

import React from "react";
import { RoleGuard } from "@/shared/components/role-guard";
import { EventSetupWizard } from "@/features/events/components/EventSetupWizard";
import { PageHeader } from "@/features/admin/components/common/PageHeader";

export default function EventSetupPage() {
  return (
    <RoleGuard requiredRole="ORGANIZER" redirectTo="/">
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <PageHeader
          title="Event Setup Wizard"
          subtitle="Create an event and configure ticket types"
        />
        <EventSetupWizard />
      </div>
    </RoleGuard>
  );
}
