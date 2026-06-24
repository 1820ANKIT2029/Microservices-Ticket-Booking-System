import { memo } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  align?: "left" | "center";
}

export const SectionHeader = memo(function SectionHeader({
  title,
  subtitle,
  actionLabel,
  actionHref = "#",
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8",
        align === "center"
          ? "text-center"
          : "flex flex-col gap-2 md:flex-row md:justify-between md:items-end",
        className
      )}
    >
      <div>
        <h2 className="text-headline-md font-semibold text-on-surface">
          {title}
        </h2>
        {subtitle && (
          <p className="text-on-surface-variant text-body-md mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {actionLabel && (
        <Link
          href={actionHref}
          className="text-primary text-label-md font-semibold flex items-center gap-1 hover:underline"
        >
          {actionLabel}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
});
