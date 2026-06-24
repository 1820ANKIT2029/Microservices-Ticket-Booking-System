package com.ankit.payment_service.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingRequestDTO {
    private Long bookingId;
    private String userId;
    private BigDecimal amount;
    private String currencyCode;
}
