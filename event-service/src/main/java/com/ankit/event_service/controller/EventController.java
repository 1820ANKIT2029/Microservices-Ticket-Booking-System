package com.ankit.event_service.controller;

import com.ankit.event_service.dto.EventDTO;
import com.ankit.event_service.service.IEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final IEventService eventService;

    @PostMapping("")
    public ResponseEntity<EventDTO> createEvent(@RequestBody EventDTO eventdto){
        EventDTO eventDTO = this.eventService.createEvent(eventdto);
        return ResponseEntity.status(HttpStatus.CREATED).body(eventDTO);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventDTO> getEvent(@PathVariable Long eventId) {
        EventDTO eventDTO = this.eventService.getEvent(eventId);
        return ResponseEntity.ok(eventDTO);
    }

}
