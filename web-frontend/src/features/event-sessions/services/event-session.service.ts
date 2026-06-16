import { api } from "@/shared/api";
import { ApiResponse } from "@/shared/types/api-response";
import { EventSessionDTO } from "@/features/events/types";

export const EventSessionService = {
  getSessions: () => api.get<ApiResponse<EventSessionDTO[]>>("/event/api/event-session"),
  getSessionById: (id: number | string) => api.get<ApiResponse<EventSessionDTO>>(`/event/api/event-session/${id}`),
  createSession: (data: Partial<EventSessionDTO>) => api.post<ApiResponse<EventSessionDTO>>("/event/api/event-session", data),
  updateSession: (id: number | string, data: Partial<EventSessionDTO>) => api.put<ApiResponse<EventSessionDTO>>(`/event/api/event-session/${id}`, data),
  deleteSession: (id: number | string) => api.delete<ApiResponse<void>>(`/event/api/event-session/${id}`),
};
