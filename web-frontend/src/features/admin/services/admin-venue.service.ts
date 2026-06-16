import { api } from "@/shared/api";
import { ApiResponse } from "@/shared/types/api-response";
import { VenueDTO } from "@/features/events/types";

export const AdminVenueService = {
  getVenues: () => api.get<ApiResponse<VenueDTO[]>>("/event/api/venues"),
  getVenueById: (id: number | string) => api.get<ApiResponse<VenueDTO>>(`/event/api/venues/${id}`),
  createVenue: (data: Partial<VenueDTO>) => api.post<ApiResponse<VenueDTO>>("/event/api/venues", data),
  updateVenue: (id: number | string, data: Partial<VenueDTO>) => api.put<ApiResponse<VenueDTO>>(`/event/api/venues/${id}`, data),
  deleteVenue: (id: number | string) => api.delete<ApiResponse<void>>(`/event/api/venues/${id}`),
};
