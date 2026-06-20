"use client";

import React, { use, useState, useEffect, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { EventService } from "@/features/events/api/service";
import { toEvent } from "@/features/events/mapper";
import { EventForm } from "@/features/events/components/EventForm";
import { EventSessionStep } from "@/features/events/components/EventSessionStep";
import { PageHeader, LoadingSpinner, RoleGuard } from "@/shared/components";

function EditEventContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const { data: eventDto, isLoading, error } = useQuery({
    queryKey: ["event", "dto", id],
    queryFn: () => EventService.getEventById(id),
  });

  const [activeTab, setActiveTab] = useState<"overview" | "sessions">("overview");

  useEffect(() => {
    if (tabParam === "sessions" || tabParam === "overview") {
      setActiveTab(tabParam as "overview" | "sessions");
    }
  }, [tabParam]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "sessions", label: "Sessions" },
  ] as const;

  return (
    <div className="w-full min-h-[101vh] max-w-4xl mx-auto p-4 pt-20 md:p-8 md:pt-24">
      <PageHeader
        title="Edit Event"
        subtitle={eventDto ? `Editing ${eventDto.title}` : "Loading event details..."}
      />

      {isLoading && <LoadingSpinner message="Loading event details..." />}
      
      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-lg font-semibold border border-error/20">
          Failed to load event details. Please try again.
        </div>
      )}

      {eventDto && (
        <div className="w-full mt-6 bg-surface border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-6 border-b border-outline-variant/50 bg-surface-container-low px-6 pt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "overview" | "sessions")}
                className={`pb-3 text-sm font-bold transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="w-full p-6 md:p-8 min-h-[850px]">
            {activeTab === "overview" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold">Event Details</h2>
                  <p className="text-sm text-muted-foreground">Update the basic information for your event.</p>
                </div>
                <EventForm initialData={toEvent(eventDto)} />
              </div>
            )}
            {activeTab === "sessions" && (
              <EventSessionStep event={eventDto} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  return (
    <RoleGuard requiredRole="ORGANIZER" redirectTo="/">
      <Suspense fallback={<LoadingSpinner message="Loading..." />}>
        <EditEventContent id={id} />
      </Suspense>
    </RoleGuard>
  );
}
