"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { EventForm } from "./EventForm";
import { EventResponseDto } from "../types";

export function EventSetupWizard() {
  const router = useRouter();

  const handleEventSelected = (event: EventResponseDto) => {
    // Redirect to the event edit page with sessions tab
    router.push(`/events/edit?id=${event.id}&tab=sessions`);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-outline-variant/30 p-6 md:p-8 rounded-xl shadow-sm">
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold">Event Details</h2>
            <p className="text-sm text-muted-foreground">Fill in the basic information to create your event.</p>
          </div>
          <EventForm onSuccess={handleEventSelected} />
        </div>
      </div>
    </div>
  );
}
