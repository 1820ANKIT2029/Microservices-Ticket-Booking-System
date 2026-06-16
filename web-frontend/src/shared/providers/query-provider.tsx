"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { useState, ReactNode } from "react";
import { logger } from "@/shared/utils/logger";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            logger.error(`Query cache failed for key [${query.queryKey.join(" -> ")}]: ${error.message}`);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, variables) => {
            logger.error(`Mutation cache failed: ${error.message}`, { variables });
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
