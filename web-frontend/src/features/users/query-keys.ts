/**
 * User query key factory.
 * Mirrors the shape in shared/constants/query-keys.ts — use this inside the users feature
 * for type-safe key construction.
 */
export const userKeys = {
  all:     ["user"] as const,
  profile: ()       => [...userKeys.all, "profile"] as const,
  list:    ()       => [...userKeys.all, "list"]    as const,
  detail:  (id: string) => [...userKeys.all, "detail", id] as const,
} as const;
