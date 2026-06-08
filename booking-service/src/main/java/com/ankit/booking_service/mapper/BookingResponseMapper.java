package com.ankit.booking_service.mapper;

import com.ankit.booking_service.dto.BookingResponseDTO;
import com.ankit.booking_service.entity.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingResponseMapper {
    public BookingResponseDTO toResponseDTO(Booking booking, String gatewayPublicKey) {
        if (booking == null) {
            return null;
        }

        return BookingResponseDTO.builder()
                .bookingRef(booking.getBookingRef())
                .userId(booking.getUserId())
                .eventSessionId(booking.getEventSessionId())
                .status(booking.getStatus() != null ? booking.getStatus() : null)
                .ticketCount(booking.getTicketCount())
                .subtotal(booking.getSubtotal())
                .taxAmount(booking.getTaxAmount())
                .totalAmount(booking.getTotalAmount())
                .currency(booking.getCurrency())
                .confirmedAt(booking.getConfirmedAt())
                .createdAt(booking.getCreatedAt())
                // --- Field native to BookingResponseDTO ---
                .gatewayPublicApiKey(gatewayPublicKey)
                .build();
    }
}
