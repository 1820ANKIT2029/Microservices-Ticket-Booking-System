package com.ankit.event_service.service;

import com.ankit.event_service.dto.EventSessionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IEventSessionService {
    EventSessionDTO createEventSession(
            EventSessionDTO eventSessionDTO, Long eventId
    );
    EventSessionDTO getEventSession(Long eventSessionId, Long eventId);
    void deleteEventSession(Long eventSessionId, Long eventId);
    EventSessionDTO updateEventSession(
            Long eventSessionId, EventSessionDTO eventSessionDTO, Long eventId
    );
    List<EventSessionDTO> getEventSessionOfEvent(Long eventId);

    Page<EventSessionDTO> getEventSessionOfUser(String userId, Pageable pageable);
}
