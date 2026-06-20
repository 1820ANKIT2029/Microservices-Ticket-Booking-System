package com.ankit.event_service.controller;

import com.ankit.event_service.dto.ApiResponse;
import com.ankit.event_service.dto.EventSessionDTO;
import com.ankit.event_service.service.IEventSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events/{eventId}/event-sessions")
@RequiredArgsConstructor
public class EventSessionController {
    final private IEventSessionService eventSessionService;

    @PostMapping("")
    public ResponseEntity<ApiResponse<EventSessionDTO>> createEventSession(
            @RequestBody EventSessionDTO eventSessionDTO,
            @PathVariable Long eventId
    ) {
        EventSessionDTO eventSessionDTO1 = this.eventSessionService
                .createEventSession(eventSessionDTO, eventId);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(eventSessionDTO1, "event session created")
        );
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<Iterable<EventSessionDTO>>> getAllEventSessions(
            @PathVariable Long eventId
    ) {
        Iterable<EventSessionDTO> eventSessionDTOS = this.eventSessionService
                .getEventSessionOfEvent(eventId);
        return ResponseEntity.ok(
                new ApiResponse<>(eventSessionDTOS, "event sessions details")
        );
    }

    @GetMapping("/{eventSessionId}")
    public ResponseEntity<ApiResponse<EventSessionDTO>> getEventSession(
            @PathVariable Long eventSessionId,
            @PathVariable Long eventId
    ) {
        EventSessionDTO eventSessionDTO = this.eventSessionService
                .getEventSession(eventSessionId, eventId);
        return ResponseEntity.ok(
                new ApiResponse<>(eventSessionDTO, "event session details")
        );
    }

    @PutMapping("/{eventSessionId}")
    public ResponseEntity<ApiResponse<EventSessionDTO>> updateEventSession(
            @PathVariable Long eventSessionId,
            @RequestBody EventSessionDTO eventSessionDTO,
            @PathVariable Long eventId
    ) {
        EventSessionDTO eventSessionDTO1 = this.eventSessionService
                .updateEventSession(eventSessionId, eventSessionDTO, eventId);
        return ResponseEntity.ok(
                new ApiResponse<>(eventSessionDTO1, "event session updated")
        );
    }

    @DeleteMapping("/{eventSessionId}")
    public ResponseEntity<ApiResponse<EventSessionDTO>> deleteEventSession(
            @PathVariable Long eventSessionId,
            @PathVariable Long eventId
    ) {
        this.eventSessionService.deleteEventSession(eventSessionId, eventId);
        return ResponseEntity.ok(
                new ApiResponse<>(null, "event session deleted")
        );
    }

}
