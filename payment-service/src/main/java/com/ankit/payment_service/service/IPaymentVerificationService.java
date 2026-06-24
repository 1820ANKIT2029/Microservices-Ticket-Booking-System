package com.ankit.payment_service.service;

import com.ankit.payment_service.dto.PaymentVerificationRequest;

public interface IPaymentVerificationService {
    void verifyPayment(PaymentVerificationRequest request);
}
