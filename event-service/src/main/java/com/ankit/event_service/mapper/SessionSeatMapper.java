package com.ankit.event_service.mapper;

import com.ankit.event_service.dto.SessionSeatDTO;
import com.ankit.event_service.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SessionSeatMapper {
    private final TicketTypeMapper ticketTypeMapper;

    public SessionSeatDTO toDto(SessionSeat entity) {
        if (entity == null) return null;

        return SessionSeatDTO.builder()
                .id(entity.getId())
                .eventSessionId(entity.getEventSession() != null ? entity.getEventSession().getId() : null)
                .seatId(entity.getSeat() != null ? entity.getSeat().getId() : null)
                .ticketTypeDTO(this.ticketTypeMapper.toDto(entity.getTicketType()))
                .overridePrice(entity.getOverridePrice())
                .status(entity.getStatus())
                .build();
    }

    public SessionSeat toEntity(SessionSeatDTO dto) {
        if (dto == null) return null;

        SessionSeat sessionSeat = SessionSeat.builder()
                .id(dto.getId())
                .overridePrice(dto.getOverridePrice())
                .status(dto.getStatus() != null ? dto.getStatus() : SessionSeatStatus.AVAILABLE)
                .ticketType(dto.getTicketTypeDTO() != null ? this.ticketTypeMapper.toEntity(dto.getTicketTypeDTO()) : null)
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