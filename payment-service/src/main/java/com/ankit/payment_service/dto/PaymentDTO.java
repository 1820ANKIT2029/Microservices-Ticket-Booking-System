package com.ankit.payment_service.dto;

import com.ankit.payment_service.entity.PaymentGateway;
import com.ankit.payment_service.entity.PaymentStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {
    private Long id;
    private PaymentGateway gatewayName;
    private String gatewayPaymentId;
    private String gatewayOrderId;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private String method;
    private String gatewayResponse;
    private Long bookingId;
    private String userId;
    private String completedId;
    private ZonedDateTime initiatedAt;

    private String gatewayPublicApiKey;
}