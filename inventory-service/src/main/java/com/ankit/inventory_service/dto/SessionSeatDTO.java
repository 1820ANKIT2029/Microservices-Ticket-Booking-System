package com.ankit.inventory_service.dto;

import com.ankit.inventory_service.entity.SessionSeatStatus;
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
    private BigDecimal overridePrice;
    private SessionSeatStatus status;
}