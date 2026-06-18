package com.ankit.event_service.mapper;

import com.ankit.event_service.dto.EventDTO;
import com.ankit.event_service.entity.Event;
import com.ankit.event_service.entity.Venue;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EventMapper {

    private final PerformerMapper performerMapper;
    private final EventSessionMapper eventSessionMapper;
    private final TicketTypeMapper ticketTypeMapper;

    public EventDTO toDto(Event entity) {
        if (entity == null) return null;

        return EventDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .slug(entity.getSlug())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .eventType(entity.getEventType())
                .minAge(entity.getMinAge())
                .venueId(entity.getVenue() != null ? entity.getVenue().getId() : null)
                .bannerUrl(entity.getBannerUrl())
                .posterUrl(entity.getPosterUrl())
                .isMultiSession(entity.getIsMultiSession())
                .isFeatured(entity.getIsFeatured())
                .userId(entity.getUserId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .performers(entity.getPerformers() != null ?
                        entity.getPerformers().stream().map(performerMapper::toDto).collect(Collectors.toList()) : Collections.emptyList())
                .sessions(entity.getSessions() != null ?
                        entity.getSessions().stream().map(eventSessionMapper::toDto).collect(Collectors.toList()) : Collections.emptyList())
                .ticketTypes(entity.getTicketTypes() != null ?
                        entity.getTicketTypes().stream().map(ticketTypeMapper::toDto).collect(Collectors.toList()) : Collections.emptyList())
                .build();
    }

    public Event toEntity(EventDTO dto) {
        if (dto == null) return null;

        Event event = Event.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .slug(dto.getSlug())
                .description(dto.getDescription())
                .status(dto.getStatus())
                .eventType(dto.getEventType())
                .minAge(dto.getMinAge())
                .bannerUrl(dto.getBannerUrl())
                .posterUrl(dto.getPosterUrl())
                .isMultiSession(dto.getIsMultiSession())
                .isFeatured(dto.getIsFeatured())
                .userId(dto.getUserId())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .performers(dto.getPerformers() != null ?
                        dto.getPerformers().stream().map(performerMapper::toEntity).collect(Collectors.toList()) : Collections.emptyList())
                .sessions(dto.getSessions() != null ?
                        dto.getSessions().stream().map(eventSessionMapper::toEntity).collect(Collectors.toList()) : Collections.emptyList())
                .ticketTypes(dto.getTicketTypes() != null ?
                        dto.getTicketTypes().stream().map(ticketTypeMapper::toEntity).collect(Collectors.toList()) : Collections.emptyList())
                .build();

        if (dto.getVenueId() != null) {
            Venue venue = new Venue();
            venue.setId(dto.getVenueId());
            event.setVenue(venue);
        }

        return event;
    }
}