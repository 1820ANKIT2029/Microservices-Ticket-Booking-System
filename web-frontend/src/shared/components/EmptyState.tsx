import { memo } from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export const EmptyState = memo(function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-surface-container-low rounded-xl border border-outline-variant/30">
      <Icon className="size-12 mx-auto text-outline mb-4" />
      <h3 className="text-title-md font-bold text-on-surface">{title}</h3>
      <p className="text-body-md text-on-surface-variant mt-2">{description}</p>
      {actionLabel && actionHref && (
        <Button asChild className="mt-6">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
});
