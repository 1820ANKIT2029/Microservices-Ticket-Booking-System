package com.ankit.event_service.controller;

import com.ankit.event_service.dto.EventSessionDTO;
import com.ankit.event_service.service.IEventSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/event-session")
@RequiredArgsConstructor
public class EventSessionController {
    final private IEventSessionService eventSessionService;

    @PostMapping("")
    public ResponseEntity<EventSessionDTO> createEventSession(@RequestBody EventSessionDTO eventSessionDTO) {
        System.out.println(eventSessionDTO);
        EventSessionDTO eventSessionDTO1 = this.eventSessionService.createEventSession(eventSessionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(eventSessionDTO1);
    }

    @GetMapping("{eventSessionId}")
    public ResponseEntity<EventSessionDTO> getEventSession(@PathVariable Long eventSessionId) {
        EventSessionDTO eventSessionDTO = this.eventSessionService.getEventSession(eventSessionId);
        return ResponseEntity.ok(eventSessionDTO);
    }
}
