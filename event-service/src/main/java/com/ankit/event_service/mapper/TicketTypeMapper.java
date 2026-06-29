package com.ankit.event_service.mapper;

import com.ankit.event_service.dto.TicketTypeDTO;
import com.ankit.event_service.entity.EventSession;
import com.ankit.event_service.entity.TicketType;
import org.springframework.stereotype.Component;

@Component
public class TicketTypeMapper {

    public TicketTypeDTO toDto(TicketType entity) {
        if (entity == null) return null;

        return TicketTypeDTO.builder()
                .id(entity.getId())
                .eventSessionId(entity.getEventSession() != null
                        ? entity.getEventSession().getId()
                        : null
                )
                .venueSectionIds(entity.getVenueSectionIds())
                .name(entity.getName())
                .description(entity.getDescription())
                .basePrice(entity.getBasePrice())
                .totalQuantity(entity.getTotalQuantity())
                .availableQuantity(entity.getAvailableQuantity())
                .maxPerBooking(entity.getMaxPerBooking())
                .isActive(entity.getIsActive())
                .saleStartAt(entity.getSaleStartAt())
                .saleEndAt(entity.getSaleEndAt())
                .build();
    }

    public TicketType toEntity(TicketTypeDTO dto) {
        if (dto == null) return null;

        TicketType ticketType = TicketType.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .basePrice(dto.getBasePrice())
                .totalQuantity(dto.getTotalQuantity())
                .availableQuantity(dto.getAvailableQuantity())
                .maxPerBooking(dto.getMaxPerBooking())
                .isActive(dto.getIsActive())
                .saleStartAt(dto.getSaleStartAt())
                .saleEndAt(dto.getSaleEndAt())
                .venueSectionIds(dto.getVenueSectionIds())
                .build();

        if (dto.getEventSessionId() != null) {
            EventSession session = new EventSession();
            session.setId(dto.getEventSessionId());
            ticketType.setEventSession(session);
        }

        return ticketType;
    }
}