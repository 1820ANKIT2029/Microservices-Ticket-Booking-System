package com.ankit.event_service.mapper;

import com.ankit.event_service.dto.EventSessionDTO;
import com.ankit.event_service.entity.Event;
import com.ankit.event_service.entity.EventSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EventSessionMapper {

    private final TicketTypeMapper ticketTypeMapper;

    public EventSessionDTO toDto(EventSession entity) {
        if (entity == null) return null;

        return EventSessionDTO.builder()
                .id(entity.getId())
                .eventId(entity.getEvent() != null ? entity.getEvent().getId() : null)
                .venueId(entity.getVenueId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .streamUrl(entity.getStreamUrl())
                .language(entity.getLanguage())
                .totalCapacity(entity.getTotalCapacity())
                .availableCapacity(entity.getAvailableCapacity())
                .sessionNumber(entity.getSessionNumber())
                .isRecorded(entity.getIsRecorded())
                .startDataTime(entity.getStartDateTime())
                .endDataTime(entity.getEndDateTime())
                .createdAt(entity.getCreatedAt())
                .ticketTypes(entity.getTicketTypes() != null ?
                        entity.getTicketTypes().stream().map(ticketTypeMapper::toDto).collect(Collectors.toList()) : Collections.emptyList())
                .build();
    }

    public EventSession toEntity(EventSessionDTO dto) {
        if (dto == null) return null;

        EventSession session = EventSession.builder()
                .id(dto.getId())
                .venueId(dto.getVenueId())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .status(dto.getStatus())
                .streamUrl(dto.getStreamUrl())
                .language(dto.getLanguage())
                .totalCapacity(dto.getTotalCapacity())
                .availableCapacity(dto.getAvailableCapacity())
                .sessionNumber(dto.getSessionNumber())
                .isRecorded(dto.getIsRecorded())
                .startDateTime(dto.getStartDataTime())
                .endDateTime(dto.getEndDataTime())
                .createdAt(dto.getCreatedAt())
                .ticketTypes(dto.getTicketTypes() != null ?
                        dto.getTicketTypes().stream().map(ticketTypeMapper::toEntity).collect(Collectors.toList()) : Collections.emptyList())
                .build();

        if (dto.getEventId() != null) {
            Event event = new Event();
            event.setId(dto.getEventId());
            session.setEvent(event);
        }

        return session;
    }
}