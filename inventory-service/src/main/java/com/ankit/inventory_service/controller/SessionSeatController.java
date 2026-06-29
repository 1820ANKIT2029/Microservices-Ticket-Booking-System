package com.ankit.inventory_service.controller;

import com.ankit.inventory_service.dto.ApiResponse;
import com.ankit.inventory_service.dto.SessionSeatDTO;
import com.ankit.inventory_service.service.ISessionSeatService;
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
    public ResponseEntity<ApiResponse<Void>> LockSeats(
            @RequestBody List<Long> sessionSeatsId,
            @RequestHeader("X-User-Id") String userId,
            @PathVariable Long eventSessionId
    ) {
       this.sessionSeatsService.lockSessionSeats(sessionSeatsId, eventSessionId, userId);
        return ResponseEntity.ok(
                new ApiResponse<>(null, "seats locked")
        );
    }

    @PostMapping("/batch/unlock")
    public ResponseEntity<ApiResponse<Void>> UnlockSeats(
            @RequestBody List<Long> sessionSeats,
            @RequestHeader("X-User-Id") String userId,
            @PathVariable Long eventSessionId
    ) {
       this.sessionSeatsService.unlockSessionSeats(sessionSeats, userId);
       return ResponseEntity.ok(
                new ApiResponse<>(null, "seats unlocked")
        );
    }

    @PostMapping("/batch/booked")
    public ResponseEntity<ApiResponse<Void>> BookedSeats(
            @RequestBody List<Long> sessionSeats,
            @RequestHeader("X-User-Id") String userId,
            @PathVariable Long eventSessionId
    ) {
        this.sessionSeatsService.bookedSessionSeats(sessionSeats, userId);
        return ResponseEntity.ok(
                new ApiResponse<>(null, "seats unlocked")
        );
    }

    @GetMapping("/{sessionSeatsId}")
    public ResponseEntity<ApiResponse<SessionSeatDTO>> GetSessionSeat(
            @PathVariable Long sessionSeatsId,
            @PathVariable Long eventSessionId
    ) {
        SessionSeatDTO res = this.sessionSeatsService
                .getSessionSeat(sessionSeatsId);
        return ResponseEntity.ok(
                new ApiResponse<>(res, "seat details")
        );
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
