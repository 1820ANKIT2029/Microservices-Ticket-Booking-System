"use client";

import React, { useState, useEffect } from "react";
import { EventResponseDto, PerformerRequestDto, PerformerResponseDto } from "../types";
import { EventService } from "../api/service";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PerformerStepProps {
  event: EventResponseDto;
  onBack?: () => void;
}

export function PerformerStep({ event: initialEvent, onBack }: PerformerStepProps) {
  const router = useRouter();
  const [event, setEvent] = useState<EventResponseDto>(initialEvent);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState<PerformerRequestDto>({
    name: "",
    bio: "",
    genre: "",
    nationality: "",
    websiteUrl: "",
    imageUrl: "",
    socialLink1: "",
    socialLink2: "",
    isActive: true,
  });

  const fetchEvent = async () => {
    setIsLoading(true);
    try {
      const data = await EventService.getEventById(initialEvent.id);
      setEvent(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load event data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePerformer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Create the standalone performer in the backend
      const newPerformer = await EventService.createPerformer(formData);
      
      // 2. Add to event's performer list
      const currentPerformers = event.performers || [];
      const updatedPerformers = [...currentPerformers, newPerformer];
      
      // 3. Link them to the event via the helper
      await EventService.linkPerformersToEvent(event.id, updatedPerformers);
      
      toast.success("Performer added to event!");
      
      // Reset form
      setFormData({
        name: "", bio: "", genre: "", nationality: "", websiteUrl: "", imageUrl: "", socialLink1: "", socialLink2: "", isActive: true
      });
      setShowForm(false);
      
      // Refresh list
      await fetchEvent();
    } catch (err: any) {
      toast.error(err.message || "Failed to add performer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFromEvent = async (performerId: number) => {
    if (!confirm("Are you sure you want to remove this performer from the event?")) return;
    try {
      const currentPerformers = event.performers || [];
      const updatedPerformers = currentPerformers.filter(p => p.id !== performerId);
      
      await EventService.linkPerformersToEvent(event.id, updatedPerformers);
      toast.success("Performer removed from event");
      await fetchEvent();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove performer");
    }
  };

  const inputCls = "w-full px-3 py-2 bg-surface-container-low border border-outline-variant/80 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Event Performers</h2>
          <p className="text-sm text-muted-foreground">Add artists, speakers, or teams to {event.title}</p>
        </div>
        <div className="flex gap-3">
          {onBack && <Button variant="outline" onClick={onBack}>Back to Tickets</Button>}
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>Add Performer</Button>
          )}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreatePerformer} className="p-6 bg-surface border border-outline-variant rounded-xl space-y-4">
          <h3 className="font-bold border-b border-outline-variant pb-2">New Performer</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-muted-foreground">Name *</label>
              <input required name="name" value={formData.name} onChange={handleChange} className={inputCls} placeholder="e.g. Coldplay, John Doe" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">Genre</label>
              <input name="genre" value={formData.genre} onChange={handleChange} className={inputCls} placeholder="e.g. Rock, Technology" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">Nationality</label>
              <input name="nationality" value={formData.nationality} onChange={handleChange} className={inputCls} placeholder="e.g. UK, USA" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-muted-foreground">Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} className={inputCls} rows={3} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">Image URL</label>
              <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className={inputCls} placeholder="https://..." />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">Website URL</label>
              <input type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} className={inputCls} placeholder="https://..." />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">Social Link 1</label>
              <input type="url" name="socialLink1" value={formData.socialLink1} onChange={handleChange} className={inputCls} placeholder="Twitter/X Profile..." />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">Social Link 2</label>
              <input type="url" name="socialLink2" value={formData.socialLink2} onChange={handleChange} className={inputCls} placeholder="Instagram Profile..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Performer"}</Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground text-sm">Loading performers...</div>
      ) : event.performers && event.performers.length > 0 ? (
        <div className="space-y-3">
          {event.performers.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant shadow-sm">
              <div className="flex items-center gap-4">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-full object-cover bg-outline-variant" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {p.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-lg">{p.name}</h4>
                  <p className="text-xs text-muted-foreground">{p.genre} {p.nationality && `• ${p.nationality}`}</p>
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm" className="text-error border-error/50 hover:bg-error/10" onClick={() => handleRemoveFromEvent(p.id!)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
          {onBack && (
            <div className="flex justify-end pt-8">
              <Button onClick={() => router.push("/events")} size="lg">Complete Setup</Button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-12 text-center bg-surface-container-low rounded-xl border border-dashed border-outline-variant space-y-3">
          <p className="text-muted-foreground">No performers assigned yet.</p>
          {!showForm && <Button variant="outline" onClick={() => setShowForm(true)}>Add your first Performer</Button>}
          {onBack && (
            <div className="pt-4">
              <Button variant="ghost" onClick={() => router.push("/events")} className="text-muted-foreground hover:text-primary">Skip and Complete Setup</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
