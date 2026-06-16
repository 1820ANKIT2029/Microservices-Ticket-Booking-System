import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminVenueService } from "@/features/admin/services/admin-venue.service";
import { queryKeys } from "@/shared/hooks/keys";
import { VenueDTO } from "@/features/events/types";

export function useUpdateVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<VenueDTO> }) =>
      AdminVenueService.updateVenue(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.venues.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.venues.detail(variables.id) });
    },
  });
}
