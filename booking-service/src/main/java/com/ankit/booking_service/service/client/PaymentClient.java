package com.ankit.booking_service.service.client;

import com.ankit.booking_service.dto.PaymentDTO;
import com.ankit.booking_service.dto.PaymentRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@FeignClient(
        name = "payment-service",
        path = "/api/payments"
)
public interface PaymentClient {
    @PostMapping("")
    public ResponseEntity<PaymentDTO> createPayment(@RequestBody PaymentRequestDTO bookingRequestDTO);
}
