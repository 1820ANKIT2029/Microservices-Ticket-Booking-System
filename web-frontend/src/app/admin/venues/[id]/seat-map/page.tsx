"use client";

import React from "react";
import { SeatMapEditorPage } from "@/features/venue-seat-map/components/editor/SeatMapEditorPage";
import { RoleGuard } from "@/shared/components/role-guard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminSeatMapPage({ params }: PageProps) {
  const { id } = React.use(params);

  return (
    <RoleGuard requiredRole="ADMIN" redirectTo="/">
      <main
        id="seat-map-editor"
        className="flex flex-col"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <SeatMapEditorPage venueId={Number(id)} />
      </main>
    </RoleGuard>
  );
}
