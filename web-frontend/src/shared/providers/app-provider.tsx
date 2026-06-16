"use client";

import { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { Toaster } from "sonner";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster richColors closeButton position="top-right" />
    </QueryProvider>
  );
}
