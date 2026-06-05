package com.ankit.booking_service.dto;


import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketTypeDTO {
    private Long id;
    private Long eventId;
    private Long eventSessionId;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private Integer totalQuantity;
    private Integer availableQuantity;
    private Integer maxPerBooking;
    private Boolean isActive;
    private ZonedDateTime saleStartAt;
    private ZonedDateTime saleEndAt;
}