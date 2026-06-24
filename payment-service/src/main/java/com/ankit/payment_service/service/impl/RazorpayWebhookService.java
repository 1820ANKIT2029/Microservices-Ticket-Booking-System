package com.ankit.payment_service.service.impl;

import com.ankit.payment_service.dto.PaymentEvent;
import com.ankit.payment_service.entity.Payment;
import com.ankit.payment_service.entity.PaymentStatus;
import com.ankit.payment_service.repository.PaymentRepository;
import com.ankit.payment_service.service.IWebhookService;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RazorpayWebhookService implements IWebhookService {
    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    private final PaymentRepository paymentRepository;
    private final KafkaTemplate<String, PaymentEvent> kafkaTemplate;

    @Override
    public void handlePaymentWebhook(String payload, String signature) {

        try {
            boolean isValid = Utils.verifyWebhookSignature(
                    payload,
                    signature,
                    webhookSecret
            );

            if (!isValid) {
                throw new RuntimeException("Invalid webhook signature");
            }

            JSONObject json = new JSONObject(payload);

            String eventType = json.getString("event");
            JSONObject paymentEntity = json.getJSONObject("payload")
                    .getJSONObject("payment")
                    .getJSONObject("entity");

            String orderId = paymentEntity.getString("order_id");
            String paymentId = paymentEntity.getString("id");
            JSONObject notes = paymentEntity.getJSONObject("notes");

            String bookingId = notes.getString("bookingId");

            Payment payment = this.paymentRepository
                    .findByGatewayPaymentId(orderId)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));

            PaymentEvent event = PaymentEvent.builder()
                    .orderId(orderId)
                    .paymentId(paymentId)
                    .bookingId(payment.getBookingId())
                    .build();

            switch (eventType) {

                case "payment.captured":
                    payment.setGatewayPaymentId(paymentId);
                    payment.setStatus(PaymentStatus.SUCCESS);
                    kafkaTemplate.send("payment-success-topic", event);
                    break;

                case "payment.failed":
                    payment.setStatus(PaymentStatus.FAILED);
                    kafkaTemplate.send("payment-failure-topic", event);
                    break;
            }

        } catch (RazorpayException e) {
            throw new RuntimeException("Webhook verification failed", e);
        }
    }
}
