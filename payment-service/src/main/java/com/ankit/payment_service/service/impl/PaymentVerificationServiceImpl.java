package com.ankit.payment_service.service.impl;

import com.ankit.payment_service.dto.PaymentEvent;
import com.ankit.payment_service.dto.PaymentVerificationRequest;
import com.ankit.payment_service.entity.Payment;
import com.ankit.payment_service.entity.PaymentStatus;
import com.ankit.payment_service.exception.ResourceNotFoundException;
import com.ankit.payment_service.repository.PaymentRepository;
import com.ankit.payment_service.service.IPaymentVerificationService;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
@RefreshScope
public class PaymentVerificationServiceImpl implements IPaymentVerificationService {
    @Value("${razorpay.key-secret}")
    private String keySecret;

    private final PaymentRepository paymentRepository;
    private final StreamBridge streamBridge;

    @Override
    public void verifyPayment(PaymentVerificationRequest request) {
        try {
            JSONObject attributes = new JSONObject();

            attributes.put("razorpay_order_id", request.getOrderId());
            attributes.put("razorpay_payment_id", request.getPaymentId());
            attributes.put("razorpay_signature", request.getSignature());

            boolean isValid = Utils.verifyPaymentSignature(attributes, keySecret);

            Payment payment = this.paymentRepository
                    .findByGatewayOrderId(request.getOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

            PaymentEvent event = PaymentEvent.builder()
                    .orderId(request.getOrderId())
                    .paymentId(request.getPaymentId())
                    .bookingId(payment.getBookingId())
                    .build();

            if(isValid) {
                payment.setGatewayPaymentId(request.getPaymentId());
                payment.setStatus(PaymentStatus.SUCCESS);
                streamBridge.send("payment-success-out-0", event);
            }
            else {
                payment.setStatus(PaymentStatus.FAILED);
                streamBridge.send("payment-failure-out-0", event);
            }

            this.paymentRepository.save(payment);

            log.info("Payment verification completed for payment: {}", payment);

            if (!isValid) {
                throw new RuntimeException("Payment signature verification failed");
            }

        } catch (RazorpayException e) {
            throw new RuntimeException("Payment verification failed", e);
        }
    }
}
