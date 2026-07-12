package com.ankit.event_service.service.impl;

import com.ankit.event_service.dto.EventSessionDTO;
import com.ankit.event_service.dto.EventSessionEvent;
import com.ankit.event_service.entity.*;
import com.ankit.event_service.exception.ResourceNotFoundException;
import com.ankit.event_service.mapper.EventSessionMapper;
import com.ankit.event_service.repository.EventSessionRepository;
import com.ankit.event_service.service.IEventSessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class EventSessionServiceImpl implements IEventSessionService {
    private final EventSessionRepository eventSessionRepository;
    private final EventSessionMapper eventSessionMapper;

    private final StreamBridge streamBridge;

    @Override
    @Transactional
    public EventSessionDTO createEventSession(
            EventSessionDTO eventSessionDTO, Long eventId
    ) {
        eventSessionDTO.setEventId(eventId);
        EventSession eventSession = this.eventSessionMapper.toEntity(eventSessionDTO);
        EventSession savedEventSession = this.eventSessionRepository.save(eventSession);

        // CREATE SESSION SEATS FOR SEATS IN VENUE
        EventSessionEvent eventSessionEvent = EventSessionEvent.builder()
                .eventId(eventId)
                .id(savedEventSession.getId())
                .venueId(savedEventSession.getVenueId())
                .build();

        streamBridge.send("createSessionSeats-out-0", eventSessionEvent);
        log.info("EventSessionEvent sent successfully");

        log.info("Sending eventSessionEvent: {}", eventSessionEvent);
        return this.eventSessionMapper.toDto(savedEventSession);
    }

    @Override
    public EventSessionDTO getEventSession(Long id, Long eventId) {
        EventSession eventSession = this.eventSessionRepository
                .findByIdAndEventId(id, eventId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Event Session Not Found")
                );
        return this.eventSessionMapper.toDto(eventSession);
    }

    @Override
    @Transactional
    public void deleteEventSession(Long id, Long eventId) {
        log.info("Deleting event session with id: {}", id);
        this.eventSessionRepository.deleteByIdAndEventId(id, eventId);
    }

    @Override
    @Transactional
    public EventSessionDTO updateEventSession(
            Long id, EventSessionDTO eventSessionDTO, Long eventId
    ) {
        eventSessionDTO.setId(id);
        eventSessionDTO.setEventId(eventId);
        EventSession eventSession = this.eventSessionRepository
                .findByIdAndEventId(id, eventId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Event Session Not Found")
                );

        if(eventSessionDTO.getVenueId() != null) eventSession.setVenueId(eventSessionDTO.getVenueId());
        if(eventSessionDTO.getTitle() != null) eventSession.setTitle(eventSessionDTO.getTitle());
        if(eventSessionDTO.getDescription() != null) eventSession.setDescription(eventSessionDTO.getDescription());
        if(eventSessionDTO.getStatus() != null) eventSession.setStatus(eventSessionDTO.getStatus());
        if(eventSessionDTO.getStreamUrl() != null) eventSession.setStreamUrl(eventSessionDTO.getStreamUrl());
        if(eventSessionDTO.getLanguage() != null) eventSession.setLanguage(eventSessionDTO.getLanguage());
        if(eventSessionDTO.getTotalCapacity() != null) eventSession.setTotalCapacity(eventSessionDTO.getTotalCapacity());
        if(eventSessionDTO.getAvailableCapacity() != null) eventSession.setAvailableCapacity(eventSessionDTO.getAvailableCapacity());
        if(eventSessionDTO.getSessionNumber() != null) eventSession.setSessionNumber(eventSessionDTO.getSessionNumber());
        if(eventSessionDTO.getIsRecorded() != null) eventSession.setIsRecorded(eventSessionDTO.getIsRecorded());
        if(eventSessionDTO.getStartDataTime() != null) eventSession.setStartDateTime(eventSessionDTO.getStartDataTime());
        if(eventSessionDTO.getEndDataTime() != null) eventSession.setEndDateTime(eventSessionDTO.getEndDataTime());
        if(eventSessionDTO.getStatus() != null) eventSession.setStatus(eventSessionDTO.getStatus());

        EventSession updatedEventSession = this.eventSessionRepository
                .save(eventSession);
        return this.eventSessionMapper.toDto(updatedEventSession);
    }

    @Override
    public List<EventSessionDTO> getEventSessionOfEvent(Long eventId) {
        List<EventSession> eventSessions = this.eventSessionRepository
                .findAllByEventId(eventId);
        if(!eventSessions.isEmpty()) return eventSessions.stream().map(eventSessionMapper::toDto).toList();
        return List.of();
    }

    @Override
    public Page<EventSessionDTO> getEventSessionOfUser(String userId, Pageable pageable) {
        Page<EventSession> eventSessions = this.eventSessionRepository
                .findAllByUserId(userId, pageable);

        return eventSessions.map(eventSessionMapper::toDto);
    }
}
