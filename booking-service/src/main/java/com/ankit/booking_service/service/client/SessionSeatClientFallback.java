package com.ankit.booking_service.service.client;

import com.ankit.booking_service.dto.ApiResponse;
import com.ankit.booking_service.dto.SessionSeatDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SessionSeatClientFallback implements SessionSeatClient{
    @Override
    public ApiResponse<Void> lockSeats(Long eventSessionId, List<SessionSeatDTO> sessionSeats, String userId) {
        throw new RuntimeException(
                "Event service unavailable"
        );
    }

    @Override
    public ApiResponse<Void> unlockSeats(Long eventSessionId, List<SessionSeatDTO> sessionSeats, String userId) {
        throw new RuntimeException(
                "Event service unavailable: Session Seat"
        );
    }

    @Override
    public ApiResponse<Void> bookedSeats(Long eventSessionId, List<SessionSeatDTO> sessionSeats, String userId) {
        throw new RuntimeException(
                "Event service unavailable: Session Seat"
        );
    }
}
