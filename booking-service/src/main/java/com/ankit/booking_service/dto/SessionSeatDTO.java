package com.ankit.booking_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionSeatDTO {
    private Long id;
    private Long eventSessionId;
    private Long seatId;
    private BigDecimal overridePrice;
    private TicketTypeDTO ticketType;
}
