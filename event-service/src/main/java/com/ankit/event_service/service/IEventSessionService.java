package com.ankit.event_service.service;

import com.ankit.event_service.dto.EventDTO;
import com.ankit.event_service.dto.EventSessionDTO;

import java.util.List;

public interface IEventSessionService {
    public EventSessionDTO createEventSession(
            EventSessionDTO eventSessionDTO, Long eventId
    );
    public EventSessionDTO getEventSession(Long id, Long eventId);
    public void deleteEventSession(Long id, Long eventId);
    public EventSessionDTO updateEventSession(
            Long id, EventSessionDTO eventSessionDTO, Long eventId
    );
    public List<EventSessionDTO> getEventSessionOfEvent(Long eventId);

    List<EventSessionDTO> getEventSessionOfUser(String userId);
}
