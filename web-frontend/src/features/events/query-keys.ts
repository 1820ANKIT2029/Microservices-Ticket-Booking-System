/**
 * Event query key factory.
 */
export const eventKeys = {
  all:        ["events"] as const,
  list:       (filters?: Record<string, unknown>) =>
    [...eventKeys.all, "list", filters ?? {}] as const,
  detail:     (id: string | number) =>
    [...eventKeys.all, "detail", String(id)] as const,
  featured:   () => [...eventKeys.all, "featured"] as const,
  byCategory: (category: string, page?: number, limit?: number) =>
    [...eventKeys.all, "category", category, { page, limit }] as const,
} as const;
