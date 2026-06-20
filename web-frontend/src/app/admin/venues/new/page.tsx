"use client";

import React from "react";
import { VenueForm } from "@/features/venue-seat-map";
import { PageHeader, RoleGuard } from "@/shared/components";

export default function CreateVenuePage() {
  return (
    <RoleGuard requiredRole="ADMIN" redirectTo="/">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <PageHeader
          title="Create Venue"
          subtitle="Add a new physical location for events"
        />
        <VenueForm />
      </div>
    </RoleGuard>
  );
}
