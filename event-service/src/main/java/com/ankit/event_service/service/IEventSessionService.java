package com.ankit.event_service.service;

import com.ankit.event_service.dto.EventSessionDTO;

public interface IEventSessionService {
    public EventSessionDTO createEventSession(EventSessionDTO eventSessionDTO);
    public EventSessionDTO getEventSession(Long id);
}
