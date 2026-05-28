package com.ankit.event_service.service.impl;

import com.ankit.event_service.dto.EventDTO;
import com.ankit.event_service.entity.Event;
import com.ankit.event_service.exception.ResourceNotFoundException;
import com.ankit.event_service.mapper.EventMapper;
import com.ankit.event_service.repository.EventRepository;
import com.ankit.event_service.service.IEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements IEventService {
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    @Override
    public EventDTO createEvent(EventDTO eventDTO) {
        Event event = this.eventMapper.toEntity(eventDTO);
        if (event.getSessions() != null) {
            event.getSessions().forEach(session -> {
                session.setEvent(event);
            });
        }

        if (event.getTicketTypes() != null) {
            event.getTicketTypes().forEach(ticketType -> {
                ticketType.setEvent(event);
            });
        }

        Event savedEvent = this.eventRepository.save(event);
        return eventMapper.toDto(savedEvent);
    }

    @Override
    public EventDTO getEvent(Long id) {
        Event event = this.eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found!"));
        return this.eventMapper.toDto(event);
    }
}
