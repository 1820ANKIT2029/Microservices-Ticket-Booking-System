package com.ankit.event_service.service.impl;

import com.ankit.event_service.dto.EventSessionDTO;
import com.ankit.event_service.entity.*;
import com.ankit.event_service.exception.ResourceNotFoundException;
import com.ankit.event_service.mapper.EventSessionMapper;
import com.ankit.event_service.repository.EventSessionRepository;
import com.ankit.event_service.repository.SeatRepository;
import com.ankit.event_service.repository.SessionSeatsRepository;
import com.ankit.event_service.service.IEventSessionService;
import com.ankit.event_service.service.ISessionSeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventSessionServiceImpl implements IEventSessionService {
    private final EventSessionRepository eventSessionRepository;
    private final EventSessionMapper eventSessionMapper;
    private final ISessionSeatService sessionSeatServiceImpl;

    @Override
    @Transactional
    public EventSessionDTO createEventSession(
            EventSessionDTO eventSessionDTO, Long eventId
    ) {
        eventSessionDTO.setEventId(eventId);
        EventSession eventSession = this.eventSessionMapper.toEntity(eventSessionDTO);
        EventSession savedEventSession = this.eventSessionRepository.save(eventSession);

        // CREATE SESSION SEATS FOR SEATS IN VENUE
        this.sessionSeatServiceImpl.initializeSessionSeats(savedEventSession);

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

        if(eventSessionDTO.getVenueId() != null) {
            Venue venue = Venue.builder()
                    .id(eventSessionDTO.getVenueId())
                    .build();
            eventSession.setVenue(venue);
        }

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
    public List<EventSessionDTO> getEventSessionOfUser(String userId) {
        List<EventSession> eventSessions = this.eventSessionRepository.findAllByUserId(userId);
        if(!eventSessions.isEmpty()) return eventSessions.stream().map(eventSessionMapper::toDto).toList();
        return List.of();
    }
}
