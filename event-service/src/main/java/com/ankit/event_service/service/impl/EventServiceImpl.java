package com.ankit.event_service.service.impl;

import com.ankit.event_service.dto.EventDTO;
import com.ankit.event_service.entity.Event;
import com.ankit.event_service.exception.ResourceNotFoundException;
import com.ankit.event_service.mapper.EventMapper;
import com.ankit.event_service.repository.EventRepository;
import com.ankit.event_service.service.IEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements IEventService {
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    @Override
    @Transactional
    public EventDTO createEvent(EventDTO eventDTO, String userId) {
        eventDTO.setUserId(userId);
        Event event = this.eventMapper.toEntity(eventDTO);

        Event savedEvent = this.eventRepository.save(event);
        return eventMapper.toDto(savedEvent);
    }

    @Override
    public EventDTO getEvent(Long id) {
        Event event = this.eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found!"));
        return this.eventMapper.toDto(event);
    }

    @Override
    public Page<EventDTO> getEventOfUser(String userId, Pageable pageable) {
        Page<Event> events = this.eventRepository.findAllByUserId(userId, pageable);

        return events.map(eventMapper::toDto);
    }

    @Override
    @Transactional
    public void deleteEvent(Long eventId, String userId) {
        this.eventRepository.deleteByIdAndUserId(eventId, userId);
    }

    @Override
    @Transactional
    public EventDTO modifyEvent(Long eventId, EventDTO eventDTO, String userId) {
        Event event = this.eventRepository.findByIdAndUserId(eventId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found!"));

        if(eventDTO.getTitle() != null) event.setTitle(eventDTO.getTitle());
        if(eventDTO.getDescription() != null) event.setDescription(eventDTO.getDescription());
        if(eventDTO.getStatus() != null) event.setStatus(eventDTO.getStatus());
        if(eventDTO.getSlug() != null) event.setSlug(eventDTO.getSlug());
        if(eventDTO.getEventType() != null) event.setEventType(eventDTO.getEventType());
        if(eventDTO.getIsFeatured() != null) event.setIsFeatured(eventDTO.getIsFeatured());
        if(eventDTO.getIsMultiSession() != null) event.setIsMultiSession(eventDTO.getIsMultiSession());
        if(eventDTO.getBannerUrl() != null) event.setBannerUrl(eventDTO.getBannerUrl());
        if(eventDTO.getPosterUrl() != null) event.setPosterUrl(eventDTO.getPosterUrl());
        if(eventDTO.getMinAge() != null) event.setMinAge(eventDTO.getMinAge());

        Event event1 = this.eventRepository.save(event);
        return this.eventMapper.toDto(event1);
    }
}
