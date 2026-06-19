"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventSessionService } from "../api/service";
import { sessionKeys } from "../query-keys";
import { toEventSession } from "../mapper";
import type { EventSessionRequestDto } from "../types";

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string | number; data: EventSessionRequestDto }) =>
      EventSessionService.createSession(eventId, data).then(toEventSession),

    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
      queryClient.invalidateQueries({ queryKey: sessionKeys.byEvent(session.eventId) });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      id,
      data,
    }: {
      eventId: string | number;
      id: string | number;
      data: Partial<EventSessionRequestDto>;
    }) => EventSessionService.updateSession(eventId, id, data).then(toEventSession),

    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(session.id) });
      queryClient.invalidateQueries({ queryKey: sessionKeys.byEvent(session.eventId) });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, id }: { eventId: string | number; id: string | number }) => 
      EventSessionService.deleteSession(eventId, id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}
