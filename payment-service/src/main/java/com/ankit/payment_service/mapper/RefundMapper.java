package com.ankit.payment_service.mapper;

import com.ankit.payment_service.dto.RefundDTO;
import com.ankit.payment_service.entity.Payment;
import com.ankit.payment_service.entity.Refund;
import org.springframework.stereotype.Component;

@Component
public class RefundMapper {

    public RefundDTO toDTO(Refund entity) {
        if (entity == null) return null;

        Long paymentId = (entity.getPayment() != null) ? entity.getPayment().getId() : null;

        return RefundDTO.builder()
                .id(entity.getId())
                .paymentId(paymentId)
                .gatewayRefundId(entity.getGatewayRefundId())
                .amount(entity.getAmount())
                .currency(entity.getCurrency())
                .reason(entity.getReason())
                .status(entity.getStatus())
                .bookingId(entity.getBookingId())
                .initiatedBy(entity.getInitiatedBy())
                .processedBy(entity.getProcessedBy())
                .requestedAt(entity.getRequestedAt())
                .processedAt(entity.getProcessedAt())
                .build();
    }

    public Refund toEntity(RefundDTO dto) {
        if (dto == null) return null;

        Refund refund = Refund.builder()
                .id(dto.getId())
                .gatewayRefundId(dto.getGatewayRefundId())
                .amount(dto.getAmount())
                .currency(dto.getCurrency() != null ? dto.getCurrency() : "INR")
                .reason(dto.getReason())
                .status(dto.getStatus())
                .bookingId(dto.getBookingId())
                .initiatedBy(dto.getInitiatedBy())
                .processedBy(dto.getProcessedBy())
                .requestedAt(dto.getRequestedAt())
                .processedAt(dto.getProcessedAt())
                .build();

        if (dto.getPaymentId() != null) {
            Payment paymentRef = new Payment();
            paymentRef.setId(dto.getPaymentId());
            refund.setPayment(paymentRef);
        }

        return refund;
    }
}