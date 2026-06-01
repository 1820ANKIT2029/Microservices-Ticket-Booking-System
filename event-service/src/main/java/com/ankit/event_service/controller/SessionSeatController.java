package com.ankit.event_service.controller;

import com.ankit.event_service.dto.SessionSeatDTO;
import com.ankit.event_service.service.ISessionSeatService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/session-seats")
@AllArgsConstructor
public class SessionSeatController {
    private final ISessionSeatService sessionSeatsService;

    @PostMapping("/batch/lock")
    public ResponseEntity<List<SessionSeatDTO>> LockSeats(
            @RequestBody List<SessionSeatDTO> sessionSeats
    ) {
        List<SessionSeatDTO> res = this.sessionSeatsService
                .lockSessionSeats(sessionSeats);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{sessionSeatsId}")
    public ResponseEntity<SessionSeatDTO> GetSessionSeat(
            @PathVariable Long sessionSeatsId
    ) {
        SessionSeatDTO res = this.sessionSeatsService
                .getSessionSeat(sessionSeatsId);
        return ResponseEntity.ok(res);
    }
}
