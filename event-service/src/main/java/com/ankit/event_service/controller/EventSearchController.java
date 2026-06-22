package com.ankit.event_service.controller;

import com.ankit.event_service.dto.ApiResponse;
import com.ankit.event_service.dto.EventSearchResponse;
import com.ankit.event_service.service.IEventSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/events/search")
@RequiredArgsConstructor
public class EventSearchController {
    private final IEventSearchService eventSearchService;

    @GetMapping("")
    public ResponseEntity<ApiResponse<Page<EventSearchResponse>>> searchEvents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String eventType,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<EventSearchResponse> eventSearchResponses = this.eventSearchService
                .searchEvents(keyword, status, eventType, pageable);
        return ResponseEntity.ok(
                new ApiResponse<>(eventSearchResponses, "Events Details")
        );
    }
}
