package com.ankit.event_service.service;

import com.ankit.event_service.dto.EventDTO;

import java.util.List;

public interface IEventService {
    public EventDTO createEvent(EventDTO eventDTO, String userId);
    public EventDTO getEvent(Long id);

    List<EventDTO> getEventOfUser(String userId);
    void deleteEvent(Long eventId, String userId);
    EventDTO modifyEvent(Long eventId, EventDTO eventDTO, String userId);
}
