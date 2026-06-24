package com.ankit.payment_service.controller;

import com.ankit.payment_service.dto.ApiResponse;
import com.ankit.payment_service.dto.BookingRequestDTO;
import com.ankit.payment_service.dto.PaymentDTO;
import com.ankit.payment_service.dto.PaymentVerificationRequest;
import com.ankit.payment_service.service.IPaymentService;
import com.ankit.payment_service.service.IPaymentVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final IPaymentService paymentService;
    private final IPaymentVerificationService verificationService;

    @PostMapping("")
    public ResponseEntity<ApiResponse<PaymentDTO>> createPayment(
            @RequestBody BookingRequestDTO bookingRequestDTO
    ){
        PaymentDTO paymentDTO = this.paymentService.createPayment(bookingRequestDTO);
        return ResponseEntity.ok(
                new ApiResponse<>(paymentDTO, "payment created")
        );
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<Page<PaymentDTO>>> getAllPayments(
            @RequestHeader("X-User-Id") String userId,
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<PaymentDTO> paymentDTOS = this.paymentService
                .getPaymentsOfUser(userId, pageable);

        return ResponseEntity.ok(
                new ApiResponse<>(paymentDTOS, "payment details")
        );
    }

    @GetMapping("/{paymentID}")
    public ResponseEntity<ApiResponse<PaymentDTO>> getPayment(
            @PathVariable Long paymentID,
            @RequestHeader("X-User-Id") String userId
    ){
        PaymentDTO paymentDTO = this.paymentService.getPayment(paymentID, userId);
        return ResponseEntity.ok(
                new ApiResponse<>(paymentDTO, "payment details")
        );
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<String>> verifyPayment(
            @Valid @RequestBody PaymentVerificationRequest paymentVerificationRequest
    ) {
        verificationService.verifyPayment(paymentVerificationRequest);

        return ResponseEntity.ok(
                new ApiResponse<>(null, "Payment Verified successfully")
        );
    }
}
