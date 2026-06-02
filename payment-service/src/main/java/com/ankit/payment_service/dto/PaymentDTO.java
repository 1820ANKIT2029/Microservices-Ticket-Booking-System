package com.ankit.payment_service.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {
    private Long id;
    private String gatewayName;
    private String gatewayPaymentId;
    private String gatewayOrderId;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String method;
    private String gatewayResponse;
    private Long bookingId;
    private Long userId;
    private String completedId;
    private ZonedDateTime initiatedAt;

    private String gatewayPublicApiKey;
}