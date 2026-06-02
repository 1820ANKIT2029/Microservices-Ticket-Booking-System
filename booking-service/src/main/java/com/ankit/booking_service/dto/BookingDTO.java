package com.ankit.booking_service.dto;

import com.ankit.booking_service.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    private String bookingRef;
    private Long userId;
    private Long eventSessionId;
    private BookingStatus status;
    private Integer ticketCount;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private String currency;
    private ZonedDateTime confirmedAt;
    private ZonedDateTime cancelledAt;
    private String cancelReason;
    private ZonedDateTime createdAt;
    private List<TicketDTO> tickets;
}