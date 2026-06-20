"use client";

import React, { useState } from "react";
import { EventResponseDto } from "../types";
import { Button } from "@/shared/components/ui/button";
import { EventSessionForm } from "@/features/event-sessions/components/EventSessionForm";
import { EventSessionTable } from "@/features/event-sessions/components/EventSessionTable";
import { useSessionsByEvent } from "@/features/event-sessions/hooks/useSessions";
import { EventSession } from "@/features/event-sessions/types";
import { SessionTicketTypesManager } from "./SessionTicketTypesManager";

interface EventSessionStepProps {
  event: EventResponseDto;
  onBack?: () => void;
  onNext?: () => void;
}

export function EventSessionStep({ event, onBack, onNext }: EventSessionStepProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<EventSession | null>(null);

  const { data: sessions, isLoading } = useSessionsByEvent(event.id);

  const handleEdit = (session: EventSession) => {
    setEditingSession(session);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingSession(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSession(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingSession(null);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Event Sessions</h2>
          <p className="text-sm text-muted-foreground">Manage schedule and capacities for {event.title}</p>
        </div>
        <div className="flex gap-3">
          {onBack && <Button variant="outline" onClick={onBack}>Back to Event</Button>}
          {!showForm && (
            <Button onClick={handleAddNew}>Create Session</Button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-xl space-y-6">
           <EventSessionForm 
             eventId={event.id}
             initialData={editingSession} 
             onSuccess={handleSuccess} 
             onCancel={handleCancel} 
           />
           {editingSession && (
             <div className="border-t border-outline-variant/30 pt-6 mt-6">
               <SessionTicketTypesManager eventSession={editingSession} />
             </div>
           )}
        </div>
      )}

      {!showForm && (
        isLoading ? (
          <div className="py-8 text-center text-muted-foreground text-sm">Loading sessions...</div>
        ) : sessions && sessions.length > 0 ? (
          <div className="space-y-6 mt-4">
            <EventSessionTable sessions={sessions} onEdit={handleEdit} />
            {onNext && (
              <div className="flex justify-end pt-4 border-t border-outline-variant/30">
                <Button onClick={onNext} size="lg">Continue to Tickets</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 text-center bg-surface-container-low rounded-xl border border-dashed border-outline-variant space-y-3">
            <p className="text-muted-foreground">No sessions created yet.</p>
            <Button variant="outline" onClick={handleAddNew}>Add your first Session</Button>
          </div>
        )
      )}
    </div>
  );
}
