"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SeatMapEditorPage } from "@/features/venue-seat-map";
import { RoleGuard, LoadingSpinner } from "@/shared/components";

function AdminSeatMapContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return (
      <div className="p-4 bg-error-container text-on-error-container font-semibold border border-error/20 m-8 rounded-lg">
        Missing venue ID in URL.
      </div>
    );
  }

  return (
    <main
      id="seat-map-editor"
      className="flex flex-col"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <SeatMapEditorPage venueId={Number(id)} />
    </main>
  );
}

export default function AdminSeatMapPage() {
  return (
    <RoleGuard requiredRole="ADMIN" redirectTo="/">
      <Suspense fallback={<LoadingSpinner message="Loading..." />}>
        <AdminSeatMapContent />
      </Suspense>
    </RoleGuard>
  );
}
