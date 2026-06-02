package com.ankit.payment_service.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingRequestDTO {
    private Long bookingId;
    private Long userId;
    private Double amount;
    private String currencyCode;
}
