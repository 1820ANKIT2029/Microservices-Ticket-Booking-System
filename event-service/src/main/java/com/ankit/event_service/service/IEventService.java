package com.ankit.event_service.service;

import com.ankit.event_service.dto.EventDTO;

public interface IEventService {
    public EventDTO createEvent(EventDTO eventDTO);
    public EventDTO getEvent(Long id);
}
