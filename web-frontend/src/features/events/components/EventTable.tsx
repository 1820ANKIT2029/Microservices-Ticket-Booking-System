"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edit, Trash2, CalendarDays } from "lucide-react";
import { EventDTO } from "@/features/events/types";
import { Button } from "@/shared/components/ui/button";
import { DeleteDialog } from "@/features/admin/components/common/DeleteDialog";
import { DataTable } from "@/features/admin/components/common/DataTable";
import { EmptyState } from "@/features/admin/components/common/EmptyState";
import { StatusBadge } from "@/features/admin/components/common/StatusBadge";
import { useDeleteEvent } from "@/features/events/hooks/mutations/useDeleteEvent";
import { toast } from "sonner";

interface EventTableProps {
  events: EventDTO[];
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
    { header: "Event Name", accessor: "title" as keyof EventDTO },
    {
      header: "Category",
      accessor: (e: EventDTO) => <span className="capitalize">{e.eventType?.toLowerCase() || "N/A"}</span>,
    },
    {
      header: "Status",
      accessor: (e: EventDTO) => <StatusBadge status={(e.status as any) || "DRAFT"} />,
    },
    {
      header: "Actions",
      className: "text-right",
      accessor: (e: EventDTO) => (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/events/${e.id}/edit`}>
              <Edit className="size-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-error border-error/30 hover:bg-error/10"
            onClick={() => setDeleteId(e.id!)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={events} keyExtractor={(e) => String(e.id)} />
      <DeleteDialog
        isOpen={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
