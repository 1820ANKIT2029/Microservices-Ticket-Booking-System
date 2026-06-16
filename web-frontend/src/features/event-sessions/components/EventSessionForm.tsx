"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { EventSessionDTO } from "@/features/events/types";
import { useCreateSession } from "@/features/event-sessions/hooks/mutations/useCreateSession";
import { useUpdateSession } from "@/features/event-sessions/hooks/mutations/useUpdateSession";
import { useAdminEvents } from "@/features/events/hooks/queries/useAdminEvents";
import { useVenues } from "@/features/admin/hooks/queries/useVenues";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { queryKeys } from "@/shared/hooks/keys";

const sessionSchema = z.object({
  eventId: z.number().min(1, "Event is required"),
  venueId: z.number().min(1, "Venue is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  sessionDate: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  totalCapacity: z.number().min(1, "Capacity must be positive"),
  status: z.enum(["SCHEDULED", "OPEN", "CLOSED", "CANCELLED"]),
});

type SessionFormValues = z.infer<typeof sessionSchema>;

interface EventSessionFormProps {
  initialData?: EventSessionDTO;
}

export function EventSessionForm({ initialData }: EventSessionFormProps) {
  const router = useRouter();
  const createMutation = useCreateSession();
  const updateMutation = useUpdateSession();

  // Load parent entities
  const { data: eventsRes } = useAdminEvents();
  const { data: venuesRes } = useVenues();

  const events = eventsRes || [];
  const venues = venuesRes || [];

  // Parse initial dates for form
  let initDate = "";
  let initStartTime = "19:00";
  let initEndTime = "22:00";

  if (initialData?.startDataTime) {
    try {
      const d = new Date(initialData.startDataTime);
      initDate = d.toISOString().split("T")[0];
      initStartTime = d.toISOString().substring(11, 16);
    } catch (e) {}
  }
  
  if (initialData?.endDataTime) {
    try {
      const d = new Date(initialData.endDataTime);
      initEndTime = d.toISOString().substring(11, 16);
    } catch (e) {}
  }
  
  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      eventId: initialData?.eventId || 0,
      venueId: initialData?.venueId || 0,
      title: initialData?.title || "",
      description: initialData?.description || "",
      sessionDate: initDate,
      startTime: initStartTime,
      endTime: initEndTime,
      totalCapacity: initialData?.totalCapacity || 100,
      status: (initialData?.status as any) || "SCHEDULED",
    },
  });

  const onSubmit = async (data: SessionFormValues) => {
    try {
      // Reconstruct dates to match backend DTO
      const startDateTime = new Date(`${data.sessionDate}T${data.startTime}:00Z`).toISOString();
      const endDateTime = new Date(`${data.sessionDate}T${data.endTime}:00Z`).toISOString();

      const payload: Partial<EventSessionDTO> = {
        eventId: data.eventId,
        venueId: data.venueId,
        title: data.title,
        description: data.description,
        totalCapacity: data.totalCapacity,
        status: data.status,
        startDataTime: startDateTime, // DTO typo spelling
        endDataTime: endDateTime,     // DTO typo spelling
        sessionNumber: initialData?.sessionNumber || 1,
      };
      
      if (initialData?.id) {
        await updateMutation.mutateAsync({ id: initialData.id, data: payload });
        toast.success("Session updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Session created successfully");
      }
      router.push("/event-sessions");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save session");
    }
  };

  const { formState: { isSubmitting, errors } } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-surface border border-outline-variant/30 p-6 md:p-8 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Relationships */}
        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">Event *</label>
          <select
            {...form.register("eventId", { valueAsNumber: true })}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
          >
            <option value={0}>Select an event...</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
          {errors.eventId && <p className="text-error text-xs">{errors.eventId.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">Venue *</label>
          <select
            {...form.register("venueId", { valueAsNumber: true })}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
          >
            <option value={0}>Select a venue...</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          {errors.venueId && <p className="text-error text-xs">{errors.venueId.message}</p>}
        </div>

        {/* Basic Info */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-label-md font-bold text-on-surface">Session Title *</label>
          <input
            {...form.register("title")}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="e.g. Opening Night"
          />
          {errors.title && <p className="text-error text-xs">{errors.title.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-label-md font-bold text-on-surface">Description</label>
          <textarea
            {...form.register("description")}
            rows={2}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
          />
        </div>

        {/* Timing */}
        <div className="space-y-2 md:col-span-2">
          <h3 className="text-title-md font-bold border-b border-outline-variant/30 pb-2 mt-4">Date & Time</h3>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-label-md font-bold text-on-surface">Session Date *</label>
          <input
            type="date"
            {...form.register("sessionDate")}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
          {errors.sessionDate && <p className="text-error text-xs">{errors.sessionDate.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">Start Time *</label>
          <input
            type="time"
            {...form.register("startTime")}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
          {errors.startTime && <p className="text-error text-xs">{errors.startTime.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">End Time *</label>
          <input
            type="time"
            {...form.register("endTime")}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
          {errors.endTime && <p className="text-error text-xs">{errors.endTime.message}</p>}
        </div>

        {/* Settings */}
        <div className="space-y-2 md:col-span-2">
          <h3 className="text-title-md font-bold border-b border-outline-variant/30 pb-2 mt-4">Settings</h3>
        </div>

        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">Total Capacity *</label>
          <input
            type="number"
            {...form.register("totalCapacity", { valueAsNumber: true })}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
          {errors.totalCapacity && <p className="text-error text-xs">{errors.totalCapacity.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">Status *</label>
          <select
            {...form.register("status")}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
          >
            <option value="SCHEDULED">Scheduled</option>
            <option value="OPEN">Open (On Sale)</option>
            <option value="CLOSED">Closed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          {errors.status && <p className="text-error text-xs">{errors.status.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-outline-variant/30">
        <Button variant="outline" type="button" onClick={() => router.push("/event-sessions")} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Session" : "Create Session"}
        </Button>
      </div>
    </form>
  );
}
