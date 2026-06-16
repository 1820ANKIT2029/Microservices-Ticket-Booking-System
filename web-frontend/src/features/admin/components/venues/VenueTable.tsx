"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Map as MapIcon } from "lucide-react";
import { VenueDTO } from "@/features/events/types";
import { Button } from "@/shared/components/ui/button";
import { DeleteDialog } from "../common/DeleteDialog";
import { DataTable } from "../common/DataTable";
import { EmptyState } from "../common/EmptyState";
import { StatusBadge } from "../common/StatusBadge";
import { useDeleteVenue } from "@/features/admin/hooks/mutations/useDeleteVenue";
import { toast } from "sonner";
import { useRole } from "@/shared/hooks/useRole";

interface VenueTableProps {
  venues: VenueDTO[];
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
    { header: "Name", accessor: "name" as keyof VenueDTO },
    {
      header: "Location",
      accessor: (v: VenueDTO) => `${v.city}, ${v.country}`,
    },
    {
      header: "Capacity",
      accessor: (v: VenueDTO) => v.totalCapacity?.toLocaleString() || "N/A",
    },
    {
      header: "Status",
      accessor: (v: VenueDTO) => <StatusBadge status={v.isActive !== false ? "ACTIVE" : "INACTIVE"} />,
    },
    {
      header: "Actions",
      className: "text-right",
      accessor: (v: VenueDTO) => (
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
            className="text-error border-error/30 hover:bg-error/10"
            onClick={() => setDeleteId(v.id!)}
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
