package com.ankit.event_service.controller;

import com.ankit.event_service.dto.ApiResponse;
import com.ankit.event_service.dto.EventSessionDTO;
import com.ankit.event_service.service.IEventSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/event-session")
@RequiredArgsConstructor
public class EventSessionController {
    final private IEventSessionService eventSessionService;

    @PostMapping("")
    public ResponseEntity<ApiResponse<EventSessionDTO>> createEventSession(@RequestBody EventSessionDTO eventSessionDTO) {
        EventSessionDTO eventSessionDTO1 = this.eventSessionService.createEventSession(eventSessionDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(eventSessionDTO1, "event session created"));
    }

    @GetMapping("{eventSessionId}")
    public ResponseEntity<ApiResponse<EventSessionDTO>> getEventSession(@PathVariable Long eventSessionId) {
        EventSessionDTO eventSessionDTO = this.eventSessionService.getEventSession(eventSessionId);
        return ResponseEntity.ok(new ApiResponse<>(eventSessionDTO, "event session details"));
    }
}
