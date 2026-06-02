package com.ankit.payment_service.controller;

import com.ankit.payment_service.service.IWebhookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class RazorpayWebhookController {
    private final IWebhookService webhookService;

    @PostMapping("/webhook/razorpay")
    public ResponseEntity<String> handleRazorpayWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature
    ) {
        this.webhookService.handlePaymentWebhook(payload, signature);
        return ResponseEntity.ok("Webhook received");
    }
}
