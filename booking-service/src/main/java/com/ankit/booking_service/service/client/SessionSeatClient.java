package com.ankit.booking_service.service.client;

import com.ankit.booking_service.dto.ApiResponse;
import com.ankit.booking_service.dto.SessionSeatDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(
        name = "event-service",
        contextId = "sessionSeatClient"
)
public interface SessionSeatClient {
    @PostMapping("/api/event-sessions/{eventSessionId}/session-seats/batch/lock")
    ApiResponse<Void> lockSeats(
            @PathVariable Long eventSessionId,
            @RequestBody List<SessionSeatDTO> sessionSeats,
            @RequestHeader("X-User-Id") String userId
    );

    @PostMapping("/api/event-sessions/{eventSessionId}/session-seats/batch/unlock")
    ApiResponse<Void> unlockSeats(
            @PathVariable Long eventSessionId,
            @RequestBody List<SessionSeatDTO> sessionSeats,
            @RequestHeader("X-User-Id") String userId
    );

    @PostMapping("/api/event-sessions/{eventSessionId}/session-seats/batch/booked")
    ApiResponse<Void> bookedSeats(
            @PathVariable Long eventSessionId,
            @RequestBody List<SessionSeatDTO> sessionSeats,
            @RequestHeader("X-User-Id") String userId
    );
}
