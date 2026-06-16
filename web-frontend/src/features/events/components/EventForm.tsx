"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { EventDTO } from "@/features/events/types";
import { useCreateEvent } from "@/features/events/hooks/mutations/useCreateEvent";
import { useUpdateEvent } from "@/features/events/hooks/mutations/useUpdateEvent";
import { useVenues } from "@/features/admin/hooks/queries/useVenues";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";

const eventSchema = z.object({
  title: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  eventType: z.string().min(1, "Category is required"),
  status: z.string(),
  venueId: z.number().min(1, "Venue is required"),
  bannerUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  posterUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isMultiSession: z.boolean(),
  isFeatured: z.boolean(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: EventDTO;
}

export function EventForm({ initialData }: EventFormProps) {
  const router = useRouter();
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  
  // Fetch venues for the dropdown
  const { data: venuesRes } = useVenues();
  const venues = venuesRes || [];
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      eventType: initialData?.eventType || "CONCERT",
      status: initialData?.status || "DRAFT",
      venueId: initialData?.venueId || 0,
      bannerUrl: initialData?.bannerUrl || "",
      posterUrl: initialData?.posterUrl || "",
      isMultiSession: initialData?.isMultiSession || false,
      isFeatured: initialData?.isFeatured || false,
    },
  });

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("title", e.target.value);
    if (!initialData) {
      form.setValue("slug", generateSlug(e.target.value));
    }
  };

  const onSubmit = async (data: EventFormValues) => {
    try {
      const payload = {
        ...data,
        createdBy: 1, // Mock user ID for now
      };
      
      if (initialData?.id) {
        await updateMutation.mutateAsync({ id: initialData.id, data: payload });
        toast.success("Event updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Event created successfully");
      }
      router.push("/events");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save event");
    }
  };

  const { formState: { isSubmitting, errors } } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-surface border border-outline-variant/30 p-6 md:p-8 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Basic Info */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-label-md font-bold text-on-surface">Event Name *</label>
          <input
            {...form.register("title")}
            onChange={handleTitleChange}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="e.g. Coldplay World Tour"
          />
          {errors.title && <p className="text-error text-xs">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">URL Slug *</label>
          <input
            {...form.register("slug")}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="e.g. coldplay-world-tour"
          />
          {errors.slug && <p className="text-error text-xs">{errors.slug.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">Category *</label>
          <select
            {...form.register("eventType")}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
          >
            <option value="CONCERT">Concert</option>
            <option value="SPORTS">Sports</option>
            <option value="MOVIE">Movie</option>
            <option value="THEATER">Theater</option>
          </select>
          {errors.eventType && <p className="text-error text-xs">{errors.eventType.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">Status *</label>
          <select
            {...form.register("status")}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">Default Venue *</label>
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

        <div className="space-y-2 md:col-span-2">
          <label className="text-label-md font-bold text-on-surface">Description</label>
          <textarea
            {...form.register("description")}
            rows={4}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
          />
        </div>

        {/* Media */}
        <div className="space-y-2 md:col-span-2">
          <h3 className="text-title-md font-bold border-b border-outline-variant/30 pb-2 mt-4">Media</h3>
        </div>

        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">Banner Image URL</label>
          <input
            {...form.register("bannerUrl")}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md"
            placeholder="https://example.com/banner.jpg"
          />
          {errors.bannerUrl && <p className="text-error text-xs">{errors.bannerUrl.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">Poster Image URL</label>
          <input
            {...form.register("posterUrl")}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md"
            placeholder="https://example.com/poster.jpg"
          />
          {errors.posterUrl && <p className="text-error text-xs">{errors.posterUrl.message}</p>}
        </div>

        {/* Options */}
        <div className="space-y-2 md:col-span-2 flex flex-col gap-3 mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...form.register("isFeatured")} className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" />
            <span className="text-label-md font-bold text-on-surface">Featured Event (Show on homepage)</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...form.register("isMultiSession")} className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" />
            <span className="text-label-md font-bold text-on-surface">Multi-Session Event (Multiple dates/times)</span>
          </label>
        </div>

      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-outline-variant/30">
        <Button variant="outline" type="button" onClick={() => router.push("/events")} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
