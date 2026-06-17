"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Clock } from "lucide-react";
import { EventSession } from "@/features/event-sessions/types";
import { Button } from "@/shared/components/ui/button";
import { DeleteDialog } from "@/features/admin/components/common/DeleteDialog";
import { DataTable } from "@/features/admin/components/common/DataTable";
import { EmptyState } from "@/features/admin/components/common/EmptyState";
import { StatusBadge } from "@/features/admin/components/common/StatusBadge";
import { useDeleteSession } from "@/features/event-sessions";
import { toast } from "sonner";

interface EventSessionTableProps {
  sessions: EventSession[];
}

export function EventSessionTable({ sessions }: EventSessionTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const deleteMutation = useDeleteSession();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Session deleted successfully");
    } catch (error) {
      toast.error("Failed to delete session");
    } finally {
      setDeleteId(null);
    }
  };

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No Sessions Found"
        description="Get started by creating a new event session."
        actionLabel="Create Session"
        actionHref="/event-sessions/new"
      />
    );
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  const columns = [
    { header: "Title", accessor: "title" as keyof EventSession },
    {
      header: "Start Date/Time",
      accessor: (s: EventSession) => formatDate(s.startDateTime),
    },
    {
      header: "Capacity",
      accessor: (s: EventSession) => s.totalCapacity?.toLocaleString() || "N/A",
    },
    {
      header: "Status",
      accessor: (s: EventSession) => <StatusBadge status={(s.status as any) || "DRAFT"} />,
    },
    {
      header: "Actions",
      className: "text-right",
      accessor: (s: EventSession) => (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/event-sessions/${s.id}/edit`}>
              <Edit className="size-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-error border-error/30 hover:bg-error/10"
            onClick={() => setDeleteId(Number(s.id))}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={sessions} keyExtractor={(s) => String(s.id)} />

      <DeleteDialog
        isOpen={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Session"
        description="Are you sure you want to delete this session? All associated tickets and seat maps might be affected."
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
