package com.ankit.event_service.service.impl;

import com.ankit.event_service.dto.EventSearchResponse;
import com.ankit.event_service.entity.Event;
import com.ankit.event_service.repository.EventRepository;
import com.ankit.event_service.service.IEventSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EventSearchServiceImpl implements IEventSearchService {
    private final EventRepository eventRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<EventSearchResponse> searchEvents(
            String keyword, String status, String eventType, Pageable pageable
    ) {
        Pageable sortedByCreatedDesc = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                pageable.getSort().and(Sort.by(Sort.Direction.DESC, "createdAt"))
        );

        Page<Event> events = eventRepository
                .searchEvents(keyword, status, eventType, sortedByCreatedDesc);

        return events.map(this::mapToSearchResponse);
    }

    private EventSearchResponse mapToSearchResponse(Event event) {
        return EventSearchResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .slug(event.getSlug())
                .eventType(event.getEventType())
                .status(event.getStatus())
                .bannerUrl(event.getBannerUrl())
                .isFeatured(event.getIsFeatured())
                .build();
    }
}
