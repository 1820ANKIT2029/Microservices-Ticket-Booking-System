package com.ankit.payment_service.mapper;

import com.ankit.payment_service.dto.PaymentDTO;
import com.ankit.payment_service.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentDTO toDTO(Payment entity) {
        if (entity == null) return null;

        return PaymentDTO.builder()
                .id(entity.getId())
                .gatewayName(entity.getGatewayName())
                .gatewayPaymentId(entity.getGatewayPaymentId())
                .gatewayOrderId(entity.getGatewayOrderId())
                .amount(entity.getAmount())
                .currency(entity.getCurrency())
                .status(entity.getStatus())
                .method(entity.getMethod())
                .gatewayResponse(entity.getGatewayResponse())
                .bookingId(entity.getBookingId())
                .userId(entity.getUserId())
                .completedId(entity.getCompletedId())
                .initiatedAt(entity.getInitiatedAt())
                .build();
    }

    public Payment toEntity(PaymentDTO dto) {
        if (dto == null) return null;

        return Payment.builder()
                .id(dto.getId())
                .gatewayName(dto.getGatewayName())
                .gatewayPaymentId(dto.getGatewayPaymentId())
                .gatewayOrderId(dto.getGatewayOrderId())
                .amount(dto.getAmount())
                .currency(dto.getCurrency() != null ? dto.getCurrency() : "INR")
                .status(dto.getStatus())
                .method(dto.getMethod())
                .gatewayResponse(dto.getGatewayResponse())
                .bookingId(dto.getBookingId())
                .userId(dto.getUserId())
                .completedId(dto.getCompletedId())
                .initiatedAt(dto.getInitiatedAt())
                .build();
    }
}