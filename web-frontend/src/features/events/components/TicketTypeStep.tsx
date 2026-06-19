"use client";

import React, { useState, useEffect } from "react";
import { EventResponseDto, TicketTypeRequestDto, TicketTypeResponseDto } from "../types";
import { EventService } from "../api/service";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TicketTypeStepProps {
  event: EventResponseDto;
  onBack?: () => void;
  onNext?: () => void;
}

export function TicketTypeStep({ event: initialEvent, onBack, onNext }: TicketTypeStepProps) {
  const router = useRouter();
  const [event, setEvent] = useState<EventResponseDto>(initialEvent);
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
  });

  const fetchEvent = async () => {
    setIsLoading(true);
    try {
      const data = await EventService.getEventById(initialEvent.id);
      setEvent(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load ticket types.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: TicketTypeRequestDto & { eventId: number } = {
        eventId: event.id,
        name: formData.name,
        description: formData.description,
        basePrice: formData.basePrice,
        totalQuantity: formData.totalQuantity,
        maxPerBooking: formData.maxPerBooking,
      };

      if (formData.saleStartAt) payload.saleStartAt = new Date(formData.saleStartAt).toISOString();
      if (formData.saleEndAt) payload.saleEndAt = new Date(formData.saleEndAt).toISOString();

      await EventService.createTicketType(payload);
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
      });
      setShowForm(false);
      
      // Refresh list
      await fetchEvent();
    } catch (err: any) {
      toast.error(err.message || "Failed to create ticket type.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (ticketTypeId: number) => {
    if (!confirm("Are you sure you want to delete this ticket type?")) return;
    try {
      await EventService.deleteTicketType(ticketTypeId, event.id);
      toast.success("Ticket type deleted");
      await fetchEvent();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete ticket type");
    }
  };

  const inputCls = "w-full px-4 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all";

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Ticket Types</h2>
          <p className="text-sm text-muted-foreground">Configure tickets for {event.title}</p>
        </div>
        <div className="flex gap-3">
          {onBack && <Button variant="outline" onClick={onBack}>Back to Event</Button>}
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>Add Ticket Type</Button>
          )}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-surface border border-outline-variant rounded-xl space-y-4">
          <h3 className="font-bold border-b border-outline-variant pb-2">New Ticket Type</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-label-md font-bold text-on-surface">Name *</label>
              <input required name="name" value={formData.name} onChange={handleChange} className={inputCls} placeholder="e.g. VIP, Early Bird" />
            </div>
            <div className="space-y-2">
              <label className="text-label-md font-bold text-on-surface">Base Price ($) *</label>
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
            <div className="space-y-2 md:col-span-2">
              <label className="text-label-md font-bold text-on-surface">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className={inputCls} rows={2} />
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
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Ticket Type"}</Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground text-sm">Loading ticket types...</div>
      ) : event.ticketTypes && event.ticketTypes.length > 0 ? (
        <div className="space-y-3">
          {event.ticketTypes.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant shadow-sm">
              <div>
                <h4 className="font-bold text-lg">{t.name}</h4>
                <p className="text-xs text-muted-foreground">{t.description || "No description"}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="font-semibold text-primary">${t.basePrice}</span>
                  <span className="text-muted-foreground">Qty: {t.totalQuantity}</span>
                  <span className="text-muted-foreground">Max/user: {t.maxPerBooking}</span>
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm" className="text-error border-error/50 hover:bg-error/10" onClick={() => handleDelete(t.id!)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {onNext && (
            <div className="flex justify-end pt-8">
              <Button onClick={onNext} size="lg">Complete Setup</Button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-12 text-center bg-surface-container-low rounded-xl border border-dashed border-outline-variant space-y-3">
          <p className="text-muted-foreground">No ticket types created yet.</p>
          {!showForm && <Button variant="outline" onClick={() => setShowForm(true)}>Add your first Ticket Type</Button>}
        </div>
      )}
    </div>
  );
}
