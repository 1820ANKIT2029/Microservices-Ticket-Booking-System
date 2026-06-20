export const venueSeatMapKeys = {
  all:      ["venueSeatMap"] as const,
  venue:    (venueId: number | string) =>
    [...venueSeatMapKeys.all, "venue", String(venueId)] as const,
  sections: (venueId: number | string) =>
    [...venueSeatMapKeys.all, "sections", String(venueId)] as const,
  seats:    (sectionId: number | string) =>
    [...venueSeatMapKeys.all, "seats", String(sectionId)] as const,
} as const;

export const venueKeys = {
  all: ["venues"] as const,
  lists: () => [...venueKeys.all, "list"] as const,
  list: () => [...venueKeys.lists()] as const,
  details: () => [...venueKeys.all, "detail"] as const,
  detail: (id: string | number) => [...venueKeys.details(), String(id)] as const,
} as const;
