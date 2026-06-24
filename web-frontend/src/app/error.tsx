"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { LoggerUtils as logger } from "@/shared/utils/logger";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error(`Unhandled Root Error Boundary crash: ${error.message}`, {
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-surface border border-outline-variant/30 rounded-2xl p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-error-container/15 text-error rounded-full flex items-center justify-center mx-auto border border-error/10">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
            Something went wrong!
          </h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            An unexpected application error occurred. We have logged the error details.
          </p>
        </div>

        {error.digest && (
          <div className="px-3 py-1.5 bg-surface-container rounded-lg text-[10px] font-bold text-outline uppercase tracking-wider inline-block">
            Error Digest: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 px-6 py-3.5 bg-primary text-on-primary rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md cursor-pointer border-none"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="flex-1 px-6 py-3.5 bg-white border border-outline-variant/60 text-primary rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-container hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
