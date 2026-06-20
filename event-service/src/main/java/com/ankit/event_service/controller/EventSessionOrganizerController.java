package com.ankit.event_service.controller;

import com.ankit.event_service.dto.ApiResponse;
import com.ankit.event_service.dto.EventSessionDTO;
import com.ankit.event_service.service.IEventSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/event-sessions")
@RequiredArgsConstructor
public class EventSessionOrganizerController {
    private final IEventSessionService eventSessionService;

    @GetMapping("")
    public ResponseEntity<ApiResponse<Iterable<EventSessionDTO>>> getAllEventSessionsOfUser(
            @RequestHeader("X-User-Id") String userId
    ){
        List<EventSessionDTO> eventDTOS = this.eventSessionService.getEventSessionOfUser(userId);
        return ResponseEntity.ok(new ApiResponse<>(eventDTOS, "events session details"));
    }
}
