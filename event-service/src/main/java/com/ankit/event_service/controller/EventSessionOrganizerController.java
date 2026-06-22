package com.ankit.event_service.controller;

import com.ankit.event_service.dto.ApiResponse;
import com.ankit.event_service.dto.EventSessionDTO;
import com.ankit.event_service.service.IEventSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
    public ResponseEntity<ApiResponse<Page<EventSessionDTO>>> getAllEventSessionsOfUser(
            @RequestHeader("X-User-Id") String userId,
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ){
        Page<EventSessionDTO> eventPage = this.eventSessionService
                .getEventSessionOfUser(userId, pageable);

        return ResponseEntity.ok(new ApiResponse<>(eventPage, "events session details"));
    }
}
