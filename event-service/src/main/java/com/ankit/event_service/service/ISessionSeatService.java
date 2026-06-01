package com.ankit.event_service.service;

import com.ankit.event_service.dto.SessionSeatDTO;

import java.util.List;

public interface ISessionSeatService {
    public SessionSeatDTO getSessionSeat(Long sessionSeatId);
    public List<SessionSeatDTO> lockSessionSeats(
            List<SessionSeatDTO> sessionSeatsDTO
    );
}
