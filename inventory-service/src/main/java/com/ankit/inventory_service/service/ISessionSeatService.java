package com.ankit.inventory_service.service;

import com.ankit.inventory_service.dto.EventSessionEvent;
import com.ankit.inventory_service.dto.SessionSeatDTO;

import java.util.List;

public interface ISessionSeatService {
    SessionSeatDTO getSessionSeat(Long sessionSeatId);
    List<SessionSeatDTO> getSessionSeats(Long eventSessionId);
    void lockSessionSeats(
            List<Long> sessionSeatIds, Long eventSessionId, String userId
    );
    void unlockSessionSeats(
            List<Long> sessionSeatIds,
            String userId
    );
    void bookedSessionSeats(
            List<Long> sessionSeatIds,
            String userId
    );
    void releaseExpiredLocks();
    void initializeSessionSeats(EventSessionEvent eventSessionEvent);
}
