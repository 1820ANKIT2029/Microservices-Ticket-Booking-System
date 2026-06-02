package com.ankit.payment_service.service.impl;

import com.ankit.payment_service.service.IWebhookService;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RazorpayWebhookService implements IWebhookService {
    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    @Value("${razorpay.webhook.event_type}")
    private String eventType;

    // TODO: feign client

    public void handlePaymentWebhook(String payload, String signature) {

        try {
            boolean isValid = Utils.verifyWebhookSignature(payload, signature, webhookSecret);
            if (!isValid) {
                throw new RuntimeException("Invalid Signature Match");
            }

            JSONObject json = new JSONObject();

            if ("order.paid".equals(eventType)) {
                JSONObject notes = json.getJSONObject("payload")
                        .getJSONObject("payment")
                        .getJSONObject("entity")
                        .getJSONObject("notes");

                String bookingId = notes.getString("bookingId");

                // TODO: feign client to notify booking-service
            }
        } catch (RazorpayException e) {
            throw new RuntimeException(e);
        }
    }
}
