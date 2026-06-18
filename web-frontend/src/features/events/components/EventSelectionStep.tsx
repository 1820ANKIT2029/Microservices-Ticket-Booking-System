"use client";

import React, { useEffect, useState } from "react";
import { EventService } from "../api/service";
import { EventResponseDto } from "../types";
import { EventForm } from "./EventForm";
import { Button } from "@/shared/components/ui/button";

interface EventSelectionStepProps {
  onEventSelected: (event: EventResponseDto) => void;
}

export function EventSelectionStep({ onEventSelected }: EventSelectionStepProps) {
  const [events, setEvents] = useState<EventResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    EventService.getAllEvents()
      .then((data) => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load events", err);
        setIsLoading(false);
      });
  }, []);

  if (showCreateForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Create New Event</h2>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            Back to Event List
          </Button>
        </div>
        <EventForm onSuccess={(event) => onEventSelected(event)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Select an Event</h2>
        <Button onClick={() => setShowCreateForm(true)}>Create New Event</Button>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center text-muted-foreground">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="py-12 text-center space-y-4 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
          <p className="text-muted-foreground">You don't have any events yet.</p>
          <Button onClick={() => setShowCreateForm(true)}>Create your first Event</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-4 rounded-xl border border-outline-variant bg-surface hover:border-primary/50 transition-colors cursor-pointer shadow-sm group"
              onClick={() => onEventSelected(evt)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {evt.status}
                </span>
                <span className="text-[10px] text-muted-foreground">{evt.eventType}</span>
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{evt.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                {evt.description || "No description provided."}
              </p>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={() => onEventSelected(evt)}>
                  Select Event
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
