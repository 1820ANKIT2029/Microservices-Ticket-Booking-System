package com.ankit.booking_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionSeatRequest {
    private Long sessionSeatId;
    private Long eventSessionId;
    private Long seatId;
    private Long ticketTypeId;
}
