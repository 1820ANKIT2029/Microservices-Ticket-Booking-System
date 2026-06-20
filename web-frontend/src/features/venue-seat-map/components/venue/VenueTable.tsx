"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Map as MapIcon } from "lucide-react";
import { Venue } from "@/features/events/types";
import { Button, DeleteDialog, DataTable, EmptyState, StatusBadge } from "@/shared/components";
import { useDeleteVenue } from "@/features/venue-seat-map";
import { toast } from "sonner";
import { useRole } from "@/shared/hooks/useRole";

interface VenueTableProps {
  venues: Venue[];
}

export function VenueTable({ venues }: VenueTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { isAdmin } = useRole();
  const deleteMutation = useDeleteVenue();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Venue deleted successfully");
    } catch (error) {
      toast.error("Failed to delete venue");
    } finally {
      setDeleteId(null);
    }
  };

  if (venues.length === 0) {
    return (
      <EmptyState
        icon={MapIcon}
        title="No Venues Found"
        description={isAdmin ? "Get started by creating a new venue." : "There are currently no venues available."}
        actionLabel={isAdmin ? "Create Venue" : undefined}
        actionHref={isAdmin ? "/admin/venues/new" : undefined}
      />
    );
  }

  const columns = [
    { header: "Name", accessor: "name" as keyof Venue },
    {
      header: "Location",
      accessor: (v: Venue) => `${v.city}, ${v.country}`,
    },
    {
      header: "Capacity",
      accessor: (v: Venue) => v.totalCapacity?.toLocaleString() || "N/A",
    },
    {
      header: "Status",
      accessor: (v: Venue) => <StatusBadge status={v.isActive !== false ? "ACTIVE" : "INACTIVE"} />,
    },
    {
      header: "Actions",
      className: "text-right",
      accessor: (v: Venue) => (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/venues/${v.id}/edit`}>
              <Edit className="size-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/venues/${v.id}/seat-map`}>
              <MapIcon className="size-4 mr-2" />
              Seat Map
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteId(Number(v.id))}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={venues} keyExtractor={(v) => String(v.id)} />

      <DeleteDialog
        isOpen={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Venue"
        description="Are you sure you want to delete this venue? This action cannot be undone and may affect associated events."
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
