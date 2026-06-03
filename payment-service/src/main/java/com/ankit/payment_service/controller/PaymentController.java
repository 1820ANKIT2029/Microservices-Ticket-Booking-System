package com.ankit.payment_service.controller;

import com.ankit.payment_service.dto.BookingRequestDTO;
import com.ankit.payment_service.dto.PaymentDTO;
import com.ankit.payment_service.service.IPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final IPaymentService paymentService;

    @PostMapping("")
    public ResponseEntity<PaymentDTO> createPayment(@RequestBody BookingRequestDTO bookingRequestDTO){
        PaymentDTO paymentDTO = this.paymentService.createPayment(bookingRequestDTO);
        return ResponseEntity.ok(paymentDTO);
    }
}
