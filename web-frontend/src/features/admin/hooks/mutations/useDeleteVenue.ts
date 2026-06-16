import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminVenueService } from "@/features/admin/services/admin-venue.service";
import { queryKeys } from "@/shared/hooks/keys";

export function useDeleteVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => AdminVenueService.deleteVenue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.venues.all });
    },
  });
}
