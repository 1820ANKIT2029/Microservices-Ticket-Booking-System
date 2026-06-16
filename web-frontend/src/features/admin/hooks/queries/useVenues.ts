import { useQuery } from "@tanstack/react-query";
import { AdminVenueService } from "@/features/admin/services/admin-venue.service";
import { queryKeys } from "@/shared/hooks/keys";

export function useVenues() {
  return useQuery({
    queryKey: queryKeys.venues.list(),
    queryFn: async () => {
      const res = await AdminVenueService.getVenues();
      return res.data.data;
    },
  });
}
