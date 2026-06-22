package com.ankit.event_service.controller;

import com.ankit.event_service.dto.ApiResponse;
import com.ankit.event_service.dto.EventDTO;
import com.ankit.event_service.service.IEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final IEventService eventService;

    @PostMapping("")
    public ResponseEntity<ApiResponse<EventDTO>> createEvent(
            @RequestBody EventDTO eventdto,
            @RequestHeader("X-User-Id") String userId
    ){
        EventDTO eventDTO = this.eventService.createEvent(eventdto, userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(eventDTO, "event created"));
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<Page<EventDTO>>> getAllEventsOfUser(
            @RequestHeader("X-User-Id") String userId,
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ){
        Page<EventDTO> eventPage = this.eventService
                .getEventOfUser(userId, pageable);

        return ResponseEntity.ok(new ApiResponse<>(eventPage, "events details"));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<ApiResponse<EventDTO>> getEvent(@PathVariable Long eventId) {
        EventDTO eventDTO = this.eventService.getEvent(eventId);

        return ResponseEntity.ok(new ApiResponse<>(eventDTO, "event details"));
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<ApiResponse<EventDTO>> modifyEvent(
            @PathVariable Long eventId,
            @RequestBody EventDTO eventDTO,
            @RequestHeader("X-User-Id") String userId
    ) {
        EventDTO eventDTO1 = this.eventService.modifyEvent(eventId, eventDTO, userId);

        return ResponseEntity.ok(
                new ApiResponse<>(eventDTO1, "event updated")
        );
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<ApiResponse<EventDTO>> deleteEvent(
            @PathVariable Long eventId,
            @RequestHeader("X-User-Id") String userId
    ) {
        this.eventService.deleteEvent(eventId, userId);

        return ResponseEntity.ok(new ApiResponse<>(null, "event deleted"));
    }
}
