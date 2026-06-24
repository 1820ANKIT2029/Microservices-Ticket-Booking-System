package com.ankit.booking_service.service.client;

import com.ankit.booking_service.dto.ApiResponse;
import com.ankit.booking_service.dto.PaymentDTO;
import com.ankit.booking_service.dto.PaymentRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "payment-service",
        path = "/api/payments",
        contextId = "paymentClient"
)
public interface PaymentClient {
    @PostMapping("")
    ApiResponse<PaymentDTO> createPayment(
            @RequestBody PaymentRequestDTO bookingRequestDTO
    );
}
