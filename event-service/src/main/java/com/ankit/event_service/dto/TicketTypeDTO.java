package com.ankit.event_service.dto;

import jakarta.validation.constraints.*;
import lombok.*;
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

    @NotBlank(message = "Ticket tier designation tier name is required")
    @Size(max = 255, message = "Ticket type name must not exceed 255 characters")
    private String name;

    private String description;

    @NotNull(message = "Base entry price point field is required")
    @DecimalMin(value = "0.00", message = "Base price tier cannot drop below free admission ($0.00)")
    @Digits(integer = 8, fraction = 2, message = "Invalid monetary format boundary structure")
    private BigDecimal basePrice;

    @NotNull(message = "Allocation volume maximum constraint is required")
    @PositiveOrZero(message = "Total quantity cannot represent negative bounds")
    private Integer totalQuantity;

    @NotNull(message = "Available ledger volume tracking field is required")
    @PositiveOrZero(message = "Available inventory quantity bounds cannot map negatively")
    private Integer availableQuantity;

    @NotNull(message = "Maximum acquisition single transaction velocity cap is required")
    @Min(value = 1, message = "At least 1 ticket must be allowed per checkout instance")
    private Integer maxPerBooking;

    private Boolean isActive;
    private ZonedDateTime saleStartAt;
    private ZonedDateTime saleEndAt;
}