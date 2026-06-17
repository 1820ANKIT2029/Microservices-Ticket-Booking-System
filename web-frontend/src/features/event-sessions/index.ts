/**
 * Event-sessions feature — public API.
 */
export { EventSessionService }    from "./api/service";
export { useSession }             from "./hooks/useSession";
export { useSessions, useSessionsByEvent } from "./hooks/useSessions";
export { useCreateSession, useUpdateSession, useDeleteSession } from "./hooks/useSessionMutations";
export type {
  EventSessionResponseDto,
  EventSessionRequestDto,
  EventSession,
  EventSessionDTO,    // @deprecated
} from "./types";
export { toEventSession, toEventSessionList } from "./mapper";
export { sessionKeys }            from "./query-keys";
