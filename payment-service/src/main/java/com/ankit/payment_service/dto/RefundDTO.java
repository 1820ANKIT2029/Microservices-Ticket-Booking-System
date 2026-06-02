package com.ankit.payment_service.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundDTO {
    private Long id;
    private Long paymentId; // Flattened reference
    private String gatewayRefundId;
    private BigDecimal amount;
    private String currency;
    private String reason;
    private String status;
    private Long bookingId;
    private String initiatedBy;
    private String processedBy;
    private ZonedDateTime requestedAt;
    private ZonedDateTime processedAt;
}