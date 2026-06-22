package com.ankit.event_service.service;

import com.ankit.event_service.dto.SessionSeatDTO;
import com.ankit.event_service.entity.EventSession;

import java.util.List;

public interface ISessionSeatService {
    public SessionSeatDTO getSessionSeat(Long sessionSeatId);
    public List<SessionSeatDTO> getSessionSeats(Long eventSessionId);
    public void lockSessionSeats(
            List<SessionSeatDTO> sessionSeatsDTO, String userId
    );
    public void unlockSessionSeats(
            List<SessionSeatDTO> sessionSeatsDTO,
            String userId
    );
    public void bookedSessionSeats(
            List<SessionSeatDTO> sessionSeatsDTO,
            String userId
    );
    public void releaseExpiredLocks();
    public void initializeSessionSeats(EventSession eventSession);
}
