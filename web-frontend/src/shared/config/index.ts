/**
 * Application configuration.
 * All environment variables and feature flags are read here — never scattered across files.
 */

export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  },

  app: {
    name:        "EventPass",
    description: "Your gateway to live experiences — movies, sports, and concerts.",
  },

  query: {
    staleTime:           5 * 60 * 1000, // 5 minutes
    gcTime:              10 * 60 * 1000, // 10 minutes
    retryCount:          1,
    refetchOnWindowFocus: false,
  },
} as const;
