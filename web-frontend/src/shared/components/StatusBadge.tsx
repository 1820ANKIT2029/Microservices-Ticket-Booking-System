import React from "react";
import { cn } from "@/shared/utils/cn";

export type StatusType = "SCHEDULED" | "OPEN" | "CLOSED" | "CANCELLED" | "DRAFT" | "PUBLISHED" | "ACTIVE" | "INACTIVE";

interface StatusBadgeProps {
  status: StatusType | boolean;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let label = String(status);
  let colorClass = "bg-surface-variant text-on-surface-variant";

  if (status === true || status === "ACTIVE" || status === "PUBLISHED" || status === "OPEN") {
    label = status === true ? "ACTIVE" : status;
    colorClass = "bg-primary/10 text-primary";
  } else if (status === false || status === "INACTIVE" || status === "CANCELLED" || status === "CLOSED") {
    label = status === false ? "INACTIVE" : status;
    colorClass = "bg-error/10 text-error";
  } else if (status === "SCHEDULED" || status === "DRAFT") {
    colorClass = "bg-secondary/10 text-secondary";
  }

  return (
    <span className={cn("px-2.5 py-1 text-label-sm font-bold rounded-full", colorClass)}>
      {label}
    </span>
  );
}
