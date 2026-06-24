package com.ankit.booking_service.service.client;

import com.ankit.booking_service.dto.ApiResponse;
import com.ankit.booking_service.dto.PaymentDTO;
import com.ankit.booking_service.dto.PaymentRequestDTO;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

@Component
public class PaymentClientFallbackFactory
        implements FallbackFactory<PaymentClient> {

    @Override
    public PaymentClient create(Throwable cause) {

        cause.printStackTrace();

        return request -> {
            throw new RuntimeException(
                    "Payment service call failed",
                    cause
            );
        };
    }
}
