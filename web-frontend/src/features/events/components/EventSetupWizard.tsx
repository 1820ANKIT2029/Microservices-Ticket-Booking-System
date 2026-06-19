"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EventForm } from "./EventForm";
import { TicketTypeStep } from "./TicketTypeStep";
import { EventResponseDto } from "../types";

export function EventSetupWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [selectedEvent, setSelectedEvent] = useState<EventResponseDto | null>(null);

  const handleEventSelected = (event: EventResponseDto) => {
    setSelectedEvent(event);
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="space-y-6">
      {/* Stepper Header */}
      <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
        <div className={`flex items-center gap-2 ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-outline-variant/50"}`}>
            1
          </div>
          <span className="font-bold">Event Details</span>
        </div>
        <div className={`h-px flex-1 ${currentStep >= 2 ? "bg-primary" : "bg-outline-variant/50"}`} />
        <div className={`flex items-center gap-2 ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-outline-variant/50"}`}>
            2
          </div>
          <span className="font-bold">Ticket Types</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="mt-8 bg-surface border border-outline-variant/30 p-6 md:p-8 rounded-xl shadow-sm">
        {currentStep === 1 && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold">Event Details</h2>
              <p className="text-sm text-muted-foreground">Fill in the basic information to create your event.</p>
            </div>
            <EventForm onSuccess={handleEventSelected} />
          </div>
        )}
        {currentStep === 2 && selectedEvent && (
          <TicketTypeStep event={selectedEvent} onBack={() => setCurrentStep(1)} onNext={() => router.push("/events")} />
        )}
      </div>
    </div>
  );
}
