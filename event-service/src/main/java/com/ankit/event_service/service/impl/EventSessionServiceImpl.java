package com.ankit.event_service.service.impl;

import com.ankit.event_service.dto.EventSessionDTO;
import com.ankit.event_service.entity.Event;
import com.ankit.event_service.entity.EventSession;
import com.ankit.event_service.entity.Venue;
import com.ankit.event_service.exception.ResourceNotFoundException;
import com.ankit.event_service.mapper.EventSessionMapper;
import com.ankit.event_service.repository.EventRepository;
import com.ankit.event_service.repository.EventSessionRepository;
import com.ankit.event_service.repository.VenueRepository;
import com.ankit.event_service.service.IEventSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventSessionServiceImpl implements IEventSessionService {
    private final EventSessionRepository eventSessionRepository;
    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;
    private final EventSessionMapper eventSessionMapper;

    @Override
    public EventSessionDTO createEventSession(EventSessionDTO eventSessionDTO) {
        EventSession eventSession = this.eventSessionMapper.toEntity(eventSessionDTO);
        EventSession savedEventSession = this.eventSessionRepository.save(eventSession);
        return this.eventSessionMapper.toDto(savedEventSession);
    }

    @Override
    public EventSessionDTO getEventSession(Long id) {
        EventSession eventSession = this.eventSessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event Session Not Found"));
        return this.eventSessionMapper.toDto(eventSession);
    }
}
