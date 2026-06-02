package com.ankit.booking_service.mapper;

import com.ankit.booking_service.dto.BookingDTO;
import com.ankit.booking_service.entity.Booking;
import com.ankit.booking_service.entity.BookingStatus;
import com.ankit.booking_service.entity.Ticket;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class BookingMapper {

    private final TicketMapper ticketMapper;

    public BookingDTO toDto(Booking entity) {
        if (entity == null) return null;

        return BookingDTO.builder()
                .id(entity.getId())
                .bookingRef(entity.getBookingRef())
                .userId(entity.getUserId())
                .eventSessionId(entity.getEventSessionId())
                .status(entity.getStatus())
                .ticketCount(entity.getTicketCount())
                .subtotal(entity.getSubtotal())
                .taxAmount(entity.getTaxAmount())
                .totalAmount(entity.getTotalAmount())
                .currency(entity.getCurrency())
                .confirmedAt(entity.getConfirmedAt())
                .cancelledAt(entity.getCancelledAt())
                .cancelReason(entity.getCancelReason())
                .createdAt(entity.getCreatedAt())
                .tickets(entity.getTickets() != null ?
                        entity.getTickets().stream().map(ticketMapper::toDto).collect(Collectors.toList()) : Collections.emptyList())
                .build();
    }

    public Booking toEntity(BookingDTO dto) {
        if (dto == null) return null;

        Booking booking = Booking.builder()
                .id(dto.getId())
                // Ensure a booking ref exists, auto-generate if coming from a fresh client request
                .bookingRef(dto.getBookingRef() != null ? dto.getBookingRef() : "BKG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .userId(dto.getUserId())
                .eventSessionId(dto.getEventSessionId())
                .status(dto.getStatus() != null ? dto.getStatus() : BookingStatus.PENDING)
                .ticketCount(dto.getTicketCount() != null ? dto.getTicketCount() : 0)
                .subtotal(dto.getSubtotal())
                .taxAmount(dto.getTaxAmount())
                .totalAmount(dto.getTotalAmount())
                .currency(dto.getCurrency() != null ? dto.getCurrency() : "USD")
                .confirmedAt(dto.getConfirmedAt())
                .cancelledAt(dto.getCancelledAt())
                .cancelReason(dto.getCancelReason())
                .createdAt(dto.getCreatedAt())
                .build();

        // Handle bidirectional relationship mapping securely
        if (dto.getTickets() != null) {
            List<Ticket> mappedTickets = dto.getTickets().stream()
                    .map(ticketMapper::toEntity)
                    .collect(Collectors.toList());

            // Set the parent booking reference for every ticket to satisfy JPA mappedBy
            mappedTickets.forEach(ticket -> ticket.setBooking(booking));
            booking.setTickets(mappedTickets);
        }

        return booking;
    }
}