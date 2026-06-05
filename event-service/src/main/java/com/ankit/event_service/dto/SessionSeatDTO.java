package com.ankit.event_service.dto;

import com.ankit.event_service.entity.SessionSeatStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionSeatDTO {
    private Long id;
    private Long eventSessionId;
    private Long seatId;
    private TicketTypeDTO ticketTypeDTO;
    private BigDecimal overridePrice;
    private SessionSeatStatus status;
}