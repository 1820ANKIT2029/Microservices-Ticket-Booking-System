export const bookingKeys = {
  all:     ["bookings"] as const,
  list:    ()         => [...bookingKeys.all, "list"]         as const,
  detail:  (id: string) => [...bookingKeys.all, "detail", id] as const,
  loyalty: ()         => [...bookingKeys.all, "loyalty"]      as const,
} as const;
