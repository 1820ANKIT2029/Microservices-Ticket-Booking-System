package com.ankit.payment_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVerificationRequest {
    @NotNull
    private String orderId;
    @NotNull
    private String paymentId;
    @NotNull
    private String signature;
}