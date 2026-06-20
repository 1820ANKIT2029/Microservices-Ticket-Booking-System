package com.ankit.event_service.mapper;

import com.ankit.event_service.dto.SessionSeatDTO;
import com.ankit.event_service.entity.EventSession;
import com.ankit.event_service.entity.Seat;
import com.ankit.event_service.entity.SessionSeat;
import com.ankit.event_service.entity.SessionSeatStatus;
import org.springframework.stereotype.Component;

@Component
public class SessionSeatMapper {

    public SessionSeatDTO toDto(SessionSeat entity) {
        if (entity == null) return null;

        return SessionSeatDTO.builder()
                .id(entity.getId())
                .eventSessionId(
                        entity.getEventSession() != null
                                ? entity.getEventSession().getId()
                                : null)
                .seatId(
                        entity.getSeat() != null
                                ? entity.getSeat().getId()
                                : null)
                .overridePrice(entity.getOverridePrice())
                .status(entity.getStatus())
                .build();
    }

    public SessionSeat toEntity(SessionSeatDTO dto) {
        if (dto == null) return null;

        SessionSeat sessionSeat = SessionSeat.builder()
                .id(dto.getId())
                .overridePrice(dto.getOverridePrice())
                .status(
                        dto.getStatus() != null
                                ? dto.getStatus()
                                : SessionSeatStatus.AVAILABLE)
                .build();

        if (dto.getEventSessionId() != null) {
            EventSession session = new EventSession();
            session.setId(dto.getEventSessionId());
            sessionSeat.setEventSession(session);
        }

        if (dto.getSeatId() != null) {
            Seat seat = new Seat();
            seat.setId(dto.getSeatId());
            sessionSeat.setSeat(seat);
        }

        return sessionSeat;
    }
}