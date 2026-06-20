"use client";

import React, { useState, useEffect } from "react";
import { EventSession } from "@/features/event-sessions/types";
import { TicketTypeRequestDto, TicketTypeResponseDto, VenueResponseDto } from "../types";
import { EventService } from "../api/service";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";

interface SessionTicketTypesManagerProps {
  eventSession: EventSession;
}

export function SessionTicketTypesManager({ eventSession }: SessionTicketTypesManagerProps) {
  const [ticketTypes, setTicketTypes] = useState<TicketTypeResponseDto[]>([]);
  const [venue, setVenue] = useState<VenueResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: 0,
    totalQuantity: 100,
    maxPerBooking: 4,
    saleStartAt: "",
    saleEndAt: "",
    venueSectionIds: [] as number[],
  });

  const fetchTicketTypes = async () => {
    setIsLoading(true);
    try {
      const data = await EventService.getTicketTypesBySession(eventSession.id);
      setTicketTypes(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load ticket types for this session.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVenueDetails = async () => {
    if (!eventSession.venueId) return;
    try {
      const venueData = await EventService.getVenueById(eventSession.venueId);
      setVenue(venueData);
    } catch (err) {
      console.error("Failed to fetch venue details:", err);
    }
  };

  useEffect(() => {
    fetchTicketTypes();
    fetchVenueDetails();
  }, [eventSession.id, eventSession.venueId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSectionToggle = (sectionId: number) => {
    setFormData((prev) => {
      const exists = prev.venueSectionIds.includes(sectionId);
      return {
        ...prev,
        venueSectionIds: exists
          ? prev.venueSectionIds.filter((id) => id !== sectionId)
          : [...prev.venueSectionIds, sectionId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: TicketTypeRequestDto = {
        name: formData.name,
        description: formData.description,
        basePrice: formData.basePrice,
        totalQuantity: formData.totalQuantity,
        maxPerBooking: formData.maxPerBooking,
        venueSectionIds: formData.venueSectionIds,
      };

      if (formData.saleStartAt) payload.saleStartAt = new Date(formData.saleStartAt).toISOString();
      if (formData.saleEndAt) payload.saleEndAt = new Date(formData.saleEndAt).toISOString();

      await EventService.createTicketType(eventSession.id, payload);
      toast.success("Ticket Type created successfully!");

      // Reset form & hide
      setFormData({
        name: "",
        description: "",
        basePrice: 0,
        totalQuantity: 100,
        maxPerBooking: 4,
        saleStartAt: "",
        saleEndAt: "",
        venueSectionIds: [],
      });
      setShowForm(false);

      // Refresh list
      await fetchTicketTypes();
    } catch (err: any) {
      toast.error(err.message || "Failed to create ticket type.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (ticketTypeId: number) => {
    if (!confirm("Are you sure you want to delete this ticket type?")) return;
    try {
      await EventService.deleteTicketType(eventSession.id, ticketTypeId);
      toast.success("Ticket type deleted");
      await fetchTicketTypes();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete ticket type");
    }
  };

  const inputCls = "w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all";

  return (
    <div className="w-full space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
        <div>
          <h3 className="text-lg font-bold">Ticket Types</h3>
          <p className="text-sm text-muted-foreground">Configure tickets and seating access for this session</p>
        </div>
        <div className="flex gap-3">
          {!showForm && (
            <Button onClick={() => setShowForm(true)} size="sm">Add Ticket Type</Button>
          )}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-surface-container-lowest border border-outline-variant/50 rounded-xl space-y-4 shadow-inner">
          <h4 className="font-bold text-on-surface">New Ticket Type</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-label-md font-bold text-on-surface">Name *</label>
              <input required name="name" value={formData.name} onChange={handleChange} className={inputCls} placeholder="e.g. VIP, Early Bird" />
            </div>
            <div className="space-y-2">
              <label className="text-label-md font-bold text-on-surface">Base Price (INR) *</label>
              <input required type="number" step="0.01" min="0" name="basePrice" value={formData.basePrice} onChange={handleChange} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-label-md font-bold text-on-surface">Total Quantity *</label>
              <input required type="number" min="1" name="totalQuantity" value={formData.totalQuantity} onChange={handleChange} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-label-md font-bold text-on-surface">Max Per Booking *</label>
              <input required type="number" min="1" name="maxPerBooking" value={formData.maxPerBooking} onChange={handleChange} className={inputCls} />
            </div>

            {/* Venue Sections selection */}
            {venue?.sections && venue.sections.length > 0 && (
              <div className="space-y-2 md:col-span-2">
                <label className="text-label-md font-bold text-on-surface">Seating Section Access (Optional)</label>
                <p className="text-xs text-muted-foreground mb-2">Select which venue sections this ticket type can access.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {venue.sections.map((sec) => (
                    <label key={sec.id} className="flex items-center gap-2.5 cursor-pointer p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/40 hover:bg-surface-container-high transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.venueSectionIds.includes(sec.id!)}
                        onChange={() => handleSectionToggle(sec.id!)}
                        className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-on-surface">{sec.name}</span>
                        <span className="text-[10px] text-muted-foreground">{sec.sectionType || "Standard"}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 md:col-span-2">
              <label className="text-label-md font-bold text-on-surface">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className={inputCls} rows={2} placeholder="Brief details about perks or notes..." />
            </div>
            <div className="space-y-2">
              <label className="text-label-md font-bold text-on-surface">Sale Start At (Optional)</label>
              <input type="datetime-local" name="saleStartAt" value={formData.saleStartAt} onChange={handleChange} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-label-md font-bold text-on-surface">Sale End At (Optional)</label>
              <input type="datetime-local" name="saleEndAt" value={formData.saleEndAt} onChange={handleChange} className={inputCls} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Ticket Type"}</Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground text-sm">Loading ticket types...</div>
      ) : ticketTypes.length > 0 ? (
        <div className="space-y-3">
          {ticketTypes.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 shadow-sm transition-all hover:shadow-md">
              <div className="space-y-1">
                <h5 className="font-bold text-base text-on-surface">{t.name}</h5>
                {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
                
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs">
                  <span className="font-semibold text-primary">Price: ₹{t.basePrice}</span>
                  <span className="text-muted-foreground">Quantity: {t.totalQuantity}</span>
                  <span className="text-muted-foreground">Max/Booking: {t.maxPerBooking}</span>
                </div>

                {t.venueSectionIds && t.venueSectionIds.length > 0 && venue?.sections && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase self-center mr-1">Sections:</span>
                    {t.venueSectionIds.map((secId) => {
                      const sectionName = venue.sections?.find((s) => s.id === secId)?.name || `Section #${secId}`;
                      return (
                        <span key={secId} className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded">
                          {sectionName}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <Button variant="outline" size="sm" className="text-error border-error/40 hover:bg-error/10 hover:text-error" onClick={() => handleDelete(t.id!)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center bg-surface-container-low rounded-xl border border-dashed border-outline-variant/60">
          <p className="text-sm text-muted-foreground">No ticket types created for this session yet.</p>
          {!showForm && (
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowForm(true)}>
              Add your first Ticket Type
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
