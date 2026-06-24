package com.ankit.booking_service.dto;


import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketTypeDTO {
    private Long id;

    private Long eventSessionId;
    private Set<Long> venueSectionIds;

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