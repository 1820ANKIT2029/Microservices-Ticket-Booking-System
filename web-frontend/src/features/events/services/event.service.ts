import { api } from "@/shared/api";
import { ApiResponse } from "@/shared/types/api-response";
import { EventDTO } from "@/features/events/types";

export const EventService = {
  // Admin Methods
  getEvents: () => api.get<ApiResponse<EventDTO[]>>("/event/api/events"),
  getEventById: (id: number | string) => api.get<ApiResponse<EventDTO>>(`/event/api/events/${id}`),
  createEvent: (data: Partial<EventDTO>) => api.post<ApiResponse<EventDTO>>("/event/api/events", data),
  updateEvent: (id: number | string, data: Partial<EventDTO>) => api.put<ApiResponse<EventDTO>>(`/event/api/events/${id}`, data),
  deleteEvent: (id: number | string) => api.delete<ApiResponse<void>>(`/event/api/events/${id}`),

  // Consumer Methods (Legacy mapping for useEvents hook)
  getMovies: (page: number, limit: number) => api.get<ApiResponse<any[]>>(`/event/api/events/category/movies?page=${page}&limit=${limit}`),
  getSports: (page: number, limit: number) => api.get<ApiResponse<any[]>>(`/event/api/events/category/sports?page=${page}&limit=${limit}`),
  getConcerts: (page: number, limit: number) => api.get<ApiResponse<any[]>>(`/event/api/events/category/concerts?page=${page}&limit=${limit}`),
  getFeaturedEvents: () => api.get<ApiResponse<any[]>>("/event/api/events/featured"),
};
