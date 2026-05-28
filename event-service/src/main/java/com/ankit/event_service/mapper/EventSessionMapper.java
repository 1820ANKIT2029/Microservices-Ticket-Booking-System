package com.ankit.event_service.mapper;

import com.ankit.event_service.dto.EventSessionDTO;
import com.ankit.event_service.entity.Event;
import com.ankit.event_service.entity.EventSession;
import com.ankit.event_service.entity.Venue;
import org.springframework.stereotype.Component;

@Component
public class EventSessionMapper {

    public EventSessionDTO toDto(EventSession entity) {
        if (entity == null) return null;

        return EventSessionDTO.builder()
                .id(entity.getId())
                .eventId(entity.getEvent() != null ? entity.getEvent().getId() : null)
                .venueId(entity.getVenue() != null ? entity.getVenue().getId() : null)
                .title(entity.getTitle())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .streamUrl(entity.getStreamUrl())
                .language(entity.getLanguage())
                .totalCapacity(entity.getTotalCapacity())
                .availableCapacity(entity.getAvailableCapacity())
                .sessionNumber(entity.getSessionNumber())
                .isRecorded(entity.getIsRecorded())
                .startDataTime(entity.getStartDataTime())
                .endDataTime(entity.getEndDataTime())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public EventSession toEntity(EventSessionDTO dto) {
        if (dto == null) return null;

        EventSession session = EventSession.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .status(dto.getStatus())
                .streamUrl(dto.getStreamUrl())
                .language(dto.getLanguage())
                .totalCapacity(dto.getTotalCapacity())
                .availableCapacity(dto.getAvailableCapacity())
                .sessionNumber(dto.getSessionNumber())
                .isRecorded(dto.getIsRecorded())
                .startDataTime(dto.getStartDataTime())
                .endDataTime(dto.getEndDataTime())
                .createdAt(dto.getCreatedAt())
                .build();

        if (dto.getEventId() != null) {
            Event event = new Event();
            event.setId(dto.getEventId());
            session.setEvent(event);
        }
        if (dto.getVenueId() != null) {
            Venue venue = new Venue();
            venue.setId(dto.getVenueId());
            session.setVenue(venue);
        }

        return session;
    }
}