import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function PageHeader({ title, subtitle, actionLabel, actionHref }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-headline-md font-bold text-on-surface">{title}</h1>
        {subtitle && <p className="text-body-md text-on-surface-variant mt-1">{subtitle}</p>}
      </div>
      {actionLabel && actionHref && (
        <Button asChild className="gap-2">
          <Link href={actionHref}>
            <Plus className="size-4" />
            {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}
