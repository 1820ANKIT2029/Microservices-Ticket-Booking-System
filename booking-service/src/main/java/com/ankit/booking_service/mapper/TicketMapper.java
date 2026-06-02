package com.ankit.booking_service.mapper;

import com.ankit.booking_service.dto.TicketDTO;
import com.ankit.booking_service.entity.Booking;
import com.ankit.booking_service.entity.Ticket;
import com.ankit.booking_service.entity.TicketStatus;
import org.springframework.stereotype.Component;

@Component
public class TicketMapper {

    public TicketDTO toDto(Ticket entity) {
        if (entity == null) return null;

        return TicketDTO.builder()
                .id(entity.getId())
                .bookingId(entity.getBooking() != null ? entity.getBooking().getId() : null)
                .userId(entity.getUserId())
                .eventSessionId(entity.getEventSessionId())
                .ticketTypeId(entity.getTicketTypeId())
                .seatId(entity.getSeatId())
                .qrCode(entity.getQrCode())
                .barCode(entity.getBarCode())
                .status(entity.getStatus())
                .pricePaid(entity.getPricePaid())
                .isChecked(entity.getIsChecked())
                .issuedAt(entity.getIssuedAt())
                .checkedInAt(entity.getCheckedInAt())
                .build();
    }

    public Ticket toEntity(TicketDTO dto) {
        if (dto == null) return null;

        Ticket ticket = Ticket.builder()
                .id(dto.getId())
                .userId(dto.getUserId())
                .eventSessionId(dto.getEventSessionId())
                .ticketTypeId(dto.getTicketTypeId())
                .seatId(dto.getSeatId())
                .qrCode(dto.getQrCode())
                .barCode(dto.getBarCode())
                .status(dto.getStatus() != null ? dto.getStatus() : TicketStatus.RESERVED)
                .pricePaid(dto.getPricePaid())
                .isChecked(dto.getIsChecked() != null ? dto.getIsChecked() : false)
                .issuedAt(dto.getIssuedAt())
                .checkedInAt(dto.getCheckedInAt())
                .build();

        // Map the parent booking reference if the ID exists
        if (dto.getBookingId() != null) {
            Booking booking = new Booking();
            booking.setId(dto.getBookingId());
            ticket.setBooking(booking);
        }

        return ticket;
    }
}