"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/shared/hooks/useRole";
import type { AppRole } from "@/shared/utils/jwt";

interface RoleGuardProps {
  /** Minimum role required to see the content */
  requiredRole: AppRole;
  /** Redirect to this path if access is denied (default: renders inline fallback) */
  redirectTo?: string;
  /** Fallback to render inline instead of redirecting */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Wraps content that should only be visible to users with a certain role.
 * Can either redirect or render a fallback when access is denied.
 */
export function RoleGuard({
  requiredRole,
  redirectTo,
  fallback,
  children,
}: RoleGuardProps) {
  const { hasRole } = useRole();
  const router = useRouter();
  const allowed = hasRole(requiredRole);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle redirect in an effect so hooks are always called unconditionally
  React.useEffect(() => {
    if (isMounted && !allowed && redirectTo) {
      router.replace(redirectTo);
    }
  }, [isMounted, allowed, redirectTo, router]);

  if (!isMounted) return null; // Prevent hydration mismatch

  if (!allowed) {
    if (redirectTo) return null;
    if (fallback) return <>{fallback}</>;
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 p-8">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-foreground">Access Restricted</h2>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          You don&apos;t have permission to view this page. Required role:{" "}
          <span className="font-semibold text-foreground">{requiredRole}</span>.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
