export const adminKeys = {
  all:    ["admin"] as const,
  venues: {
    all:    [...["admin"], "venues"] as const,
    list:   ()                      => [...["admin"], "venues", "list"]           as const,
    detail: (id: string | number)   => [...["admin"], "venues", "detail", String(id)] as const,
  },
} as const;
