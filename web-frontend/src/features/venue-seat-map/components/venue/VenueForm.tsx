"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Venue } from "@/features/events/types";
import { useCreateVenue, useUpdateVenue } from "@/features/venue-seat-map";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";

const venueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  timezone: z.string().optional(),
  totalCapacity: z.number().min(1, "Capacity must be a positive number"),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  amenities: z.string().optional(),
  isActive: z.boolean(),
});

type VenueFormValues = z.infer<typeof venueSchema>;

interface VenueFormProps {
  initialData?: Venue | null;
}

export function VenueForm({ initialData }: VenueFormProps) {
  const router = useRouter();
  const createMutation = useCreateVenue();
  const updateMutation = useUpdateVenue();
  
  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      addressLine1: initialData?.addressLine1 || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      country: initialData?.country || "",
      postalCode: initialData?.postalCode || "",
      latitude: initialData?.latitude || 0,
      longitude: initialData?.longitude || 0,
      timezone: initialData?.timezone || "UTC",
      totalCapacity: initialData?.totalCapacity || 100,
      websiteUrl: initialData?.websiteUrl || "",
      amenities: Array.isArray(initialData?.amenities) ? initialData?.amenities.join(', ') : (initialData?.amenities || ""),
      isActive: initialData?.isActive !== false,
    },
  });

  const onSubmit = async (data: VenueFormValues) => {
    try {
      if (initialData?.id) {
        await updateMutation.mutateAsync({ id: initialData.id, data });
        toast.success("Venue updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Venue created successfully");
      }
      router.push("/admin/venues");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save venue");
    }
  };

  const { formState: { isSubmitting, errors } } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-surface border border-outline-variant/30 p-6 md:p-8 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">Venue Name *</label>
          <input
            {...form.register("name")}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="e.g. Madison Square Garden"
          />
          {errors.name && <p className="text-error text-xs">{errors.name.message}</p>}
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

        <div className="space-y-2 md:col-span-2">
          <label className="text-label-md font-bold text-on-surface">Description</label>
          <textarea
            {...form.register("description")}
            rows={3}
            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
          />
        </div>

        {/* Location */}
        <div className="space-y-2 md:col-span-2">
          <h3 className="text-title-md font-bold border-b border-outline-variant/30 pb-2 mt-4">Location</h3>
        </div>

        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">Address Line 1</label>
          <input {...form.register("addressLine1")} className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg" />
        </div>

        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">City</label>
          <input {...form.register("city")} className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg" />
        </div>

        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">State/Province</label>
          <input {...form.register("state")} className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg" />
        </div>

        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">Country</label>
          <input {...form.register("country")} className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg" />
        </div>

        {/* Other Details */}
        <div className="space-y-2 md:col-span-2">
          <h3 className="text-title-md font-bold border-b border-outline-variant/30 pb-2 mt-4">Additional Details</h3>
        </div>

        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">Timezone</label>
          <input {...form.register("timezone")} className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg" placeholder="e.g. America/New_York" />
        </div>

        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface">Website URL</label>
          <input {...form.register("websiteUrl")} className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg" />
          {errors.websiteUrl && <p className="text-error text-xs">{errors.websiteUrl.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...form.register("isActive")} className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" />
            <span className="text-label-md font-bold text-on-surface">Venue is Active</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-outline-variant/30">
        <Button variant="outline" type="button" onClick={() => router.push("/admin/venues")} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Venue" : "Create Venue"}
        </Button>
      </div>
    </form>
  );
}
