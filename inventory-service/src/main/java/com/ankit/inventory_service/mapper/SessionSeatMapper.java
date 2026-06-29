package com.ankit.inventory_service.mapper;

import com.ankit.inventory_service.dto.SessionSeatDTO;
import com.ankit.inventory_service.entity.Seat;
import com.ankit.inventory_service.entity.SessionSeat;
import com.ankit.inventory_service.entity.SessionSeatStatus;
import org.springframework.stereotype.Component;

@Component
public class SessionSeatMapper {

    public SessionSeatDTO toDto(SessionSeat entity) {
        if (entity == null) return null;

        return SessionSeatDTO.builder()
                .id(entity.getId())
                .eventSessionId(entity.getEventSessionId())
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
                .eventSessionId(dto.getEventSessionId())
                .overridePrice(dto.getOverridePrice())
                .status(
                        dto.getStatus() != null
                                ? dto.getStatus()
                                : SessionSeatStatus.AVAILABLE)
                .build();

        if (dto.getSeatId() != null) {
            Seat seat = new Seat();
            seat.setId(dto.getSeatId());
            sessionSeat.setSeat(seat);
        }

        return sessionSeat;
    }
}