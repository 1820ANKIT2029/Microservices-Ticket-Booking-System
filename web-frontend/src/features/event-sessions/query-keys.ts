export const sessionKeys = {
  all:     ["eventSessions"] as const,
  list:    (filters?: Record<string, unknown>) =>
    [...sessionKeys.all, "list", filters ?? {}] as const,
  detail:  (id: string | number) =>
    [...sessionKeys.all, "detail", String(id)] as const,
  byEvent: (eventId: string | number) =>
    [...sessionKeys.all, "event", String(eventId)] as const,
} as const;
