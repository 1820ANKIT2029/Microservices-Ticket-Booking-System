export const searchKeys = {
  all:     ["search"] as const,
  results: (query: string, filters?: Record<string, unknown>) =>
    [...searchKeys.all, "results", query, filters ?? {}] as const,
} as const;
