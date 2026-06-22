package com.ankit.event_service.service;

import com.ankit.event_service.dto.EventDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IEventService {
    public EventDTO createEvent(EventDTO eventDTO, String userId);
    public EventDTO getEvent(Long id);

    Page<EventDTO> getEventOfUser(String userId, Pageable pageable);
    void deleteEvent(Long eventId, String userId);
    EventDTO modifyEvent(Long eventId, EventDTO eventDTO, String userId);
}
