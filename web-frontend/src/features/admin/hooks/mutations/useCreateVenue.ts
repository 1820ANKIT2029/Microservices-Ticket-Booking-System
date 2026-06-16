import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminVenueService } from "@/features/admin/services/admin-venue.service";
import { queryKeys } from "@/shared/hooks/keys";
import { VenueDTO } from "@/features/events/types";

export function useCreateVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<VenueDTO>) => AdminVenueService.createVenue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.venues.all });
    },
  });
}
