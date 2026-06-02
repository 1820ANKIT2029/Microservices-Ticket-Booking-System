package com.ankit.payment_service.service;

public interface IWebhookService {
    public void handlePaymentWebhook(String payload, String signature);
}
