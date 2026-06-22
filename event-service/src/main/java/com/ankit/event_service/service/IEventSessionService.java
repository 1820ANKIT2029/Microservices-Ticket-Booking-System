package com.ankit.event_service.service;

import com.ankit.event_service.dto.EventDTO;
import com.ankit.event_service.dto.EventSessionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IEventSessionService {
    public EventSessionDTO createEventSession(
            EventSessionDTO eventSessionDTO, Long eventId
    );
    public EventSessionDTO getEventSession(Long eventSessionId, Long eventId);
    public void deleteEventSession(Long eventSessionId, Long eventId);
    public EventSessionDTO updateEventSession(
            Long eventSessionId, EventSessionDTO eventSessionDTO, Long eventId
    );
    public List<EventSessionDTO> getEventSessionOfEvent(Long eventId);

    Page<EventSessionDTO> getEventSessionOfUser(String userId, Pageable pageable);
}
