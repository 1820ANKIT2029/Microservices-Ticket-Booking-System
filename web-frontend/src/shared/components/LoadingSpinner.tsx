import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center text-on-surface-variant">
      <Loader2 className="size-8 animate-spin text-primary mb-4" />
      <p className="text-label-md font-semibold">{message}</p>
    </div>
  );
}
