"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edit, Trash2, CalendarDays } from "lucide-react";
import { Event } from "@/features/events/types";
import { Button, DataTable, ConfirmDialog as DeleteDialog } from "@/shared/components";
import { EmptyState } from "@/features/admin/components/common/EmptyState";
import { StatusBadge } from "@/shared/components";
import { useDeleteEvent } from "@/features/events";
import { toast } from "sonner";

interface EventTableProps {
  events: Event[];
}

export function EventTable({ events }: EventTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const deleteMutation = useDeleteEvent();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error("Failed to delete event");
    } finally {
      setDeleteId(null);
    }
  };

  if (events.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No Events Found"
        description="Get started by creating a new event."
        actionLabel="Create Event"
        actionHref="/events/new"
      />
    );
  }

  const columns = [
    { header: "Event Name", accessor: "title" as keyof Event },
    {
      header: "Category",
      accessor: (e: Event) => <span className="capitalize">{e.eventType?.toLowerCase() || "N/A"}</span>,
    },
    {
      header: "Status",
      accessor: (e: Event) => <StatusBadge status={(e.status as any) || "DRAFT"} />,
    },
    {
      header: "Actions",
      className: "text-right",
      accessor: (e: Event) => (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/events/edit?id=${e.id}`}>
              <Edit className="size-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-error border-error/30 hover:bg-error/10"
            onClick={() => setDeleteId(Number(e.id))}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={events} keyExtractor={(e: Event) => String(e.id)} />
      <DeleteDialog
        isOpen={!!deleteId}
        onOpenChange={(open: boolean) => {
          if (!open) setDeleteId(null);
        }}
        onConfirm={handleDelete}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        isProcessing={deleteMutation.isPending}
      />
    </>
  );
}
