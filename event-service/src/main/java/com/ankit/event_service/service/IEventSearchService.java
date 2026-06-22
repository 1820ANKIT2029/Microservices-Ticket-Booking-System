package com.ankit.event_service.service;

import com.ankit.event_service.dto.EventSearchResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IEventSearchService {
    public Page<EventSearchResponse> searchEvents(
            String keyword, String status, String eventType, Pageable pageable
    );
}
