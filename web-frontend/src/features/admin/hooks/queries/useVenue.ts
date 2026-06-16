import { useQuery } from "@tanstack/react-query";
import { AdminVenueService } from "@/features/admin/services/admin-venue.service";
import { queryKeys } from "@/shared/hooks/keys";

export function useVenue(id: string | number) {
  return useQuery({
    queryKey: queryKeys.venues.detail(id),
    queryFn: async () => {
      const res = await AdminVenueService.getVenueById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}
