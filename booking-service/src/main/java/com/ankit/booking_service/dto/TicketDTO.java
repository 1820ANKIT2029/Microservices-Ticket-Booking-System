package com.ankit.booking_service.dto;

import com.ankit.booking_service.entity.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketDTO {
    private Long id;
    private Long bookingId; // Extracted to avoid passing the whole Booking object
    private String userId;
    private Long eventSessionId;
    private Long ticketTypeId;
    private Long sessionSeatId;
    private String qrCode;
    private String barCode;
    private TicketStatus status;
    private BigDecimal pricePaid;
    private Boolean isChecked;
    private ZonedDateTime issuedAt;
    private ZonedDateTime checkedInAt;
}