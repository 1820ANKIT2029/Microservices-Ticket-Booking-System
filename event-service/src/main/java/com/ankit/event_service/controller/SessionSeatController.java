package com.ankit.event_service.controller;

import com.ankit.event_service.dto.ApiResponse;
import com.ankit.event_service.dto.SessionSeatDTO;
import com.ankit.event_service.service.ISessionSeatService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-sessions/{eventSessionId}/session-seats")
@AllArgsConstructor
public class SessionSeatController {
    private final ISessionSeatService sessionSeatsService;

    @PostMapping("/batch/lock")
    public ResponseEntity<ApiResponse<List<SessionSeatDTO>>> LockSeats(
            @RequestBody List<SessionSeatDTO> sessionSeats,
            @RequestHeader("X-User-Id") String userId
    ) {
       this.sessionSeatsService.lockSessionSeats(sessionSeats, userId);
        return ResponseEntity.ok(
                new ApiResponse<>(null, "seats locked")
        );
    }

    @PostMapping("/batch/unlock")
    public ResponseEntity<ApiResponse<List<SessionSeatDTO>>> UnlockSeats(
            @RequestBody List<SessionSeatDTO> sessionSeats,
            @RequestHeader("X-User-Id") String userId
    ) {
       this.sessionSeatsService.unlockSessionSeats(sessionSeats, userId);
       return ResponseEntity.ok(
                new ApiResponse<>(null, "seats unlocked")
        );
    }

    @GetMapping("/{sessionSeatsId}")
    public ResponseEntity<ApiResponse<SessionSeatDTO>> GetSessionSeat(
            @PathVariable Long sessionSeatsId
    ) {
        SessionSeatDTO res = this.sessionSeatsService
                .getSessionSeat(sessionSeatsId);
        return ResponseEntity.ok(new ApiResponse<>(res, "seat details"));
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<List<SessionSeatDTO>>> GetSessionSeats(
            @PathVariable Long eventSessionId
    ) {
        List<SessionSeatDTO> sessionSeatDTOS = this.sessionSeatsService
                .getSessionSeats(eventSessionId);
        return ResponseEntity.ok(
                new ApiResponse<>(sessionSeatDTOS, "seats details")
        );
    }
}
