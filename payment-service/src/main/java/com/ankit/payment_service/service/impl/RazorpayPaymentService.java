package com.ankit.payment_service.service.impl;

import com.ankit.payment_service.dto.BookingRequestDTO;
import com.ankit.payment_service.dto.PaymentDTO;
import com.ankit.payment_service.entity.Payment;
import com.ankit.payment_service.exception.ResourceNotFoundException;
import com.ankit.payment_service.mapper.PaymentMapper;
import com.ankit.payment_service.mapper.RazorpayOrderMapper;
import com.ankit.payment_service.repository.PaymentRepository;
import com.ankit.payment_service.service.IPaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Currency;

@Service
@RequiredArgsConstructor
@RefreshScope
public class RazorpayPaymentService implements IPaymentService {
    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final RazorpayOrderMapper razorpayOrderMapper;
    private RazorpayClient razorpayClient;

    @Value("${razorpay.key-id}")
    private String apiKey;

    @Value("${razorpay.key-secret}")
    private String apiSecret;

    @PostConstruct
    public void init() throws RazorpayException {
        this.razorpayClient = new RazorpayClient(apiKey, apiSecret);
    }

    @Override
    @Transactional
    public PaymentDTO createPayment(BookingRequestDTO bookingRequestDTO) {
        try {
            PaymentDTO paymentDTO = this.createRazorpayOrder(
                    bookingRequestDTO.getBookingId(),
                    bookingRequestDTO.getUserId(),
                    bookingRequestDTO.getAmount(),
                    bookingRequestDTO.getCurrencyCode()
            );

            Payment payment = this.paymentMapper.toEntity(paymentDTO);

            Payment savedPayment = this.paymentRepository.save(payment);
            PaymentDTO savedPaymentDTO = this.paymentMapper.toDTO(savedPayment);
            savedPaymentDTO.setGatewayPublicApiKey(this.apiKey);

            return savedPaymentDTO;
        } catch (RazorpayException ex) {
            throw new RuntimeException("Razorpay execution dropped: " + ex.getMessage(), ex);
        }
    }

    @Override
    public PaymentDTO getPayment(Long paymentId, String userId) {
        Payment payment = this.paymentRepository
                .findAllByIdAndUserId(paymentId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        return this.paymentMapper.toDTO(payment);
    }

    @Override
    public Page<PaymentDTO> getPaymentsOfUser(String userId, Pageable pageable) {
        Page<Payment> paymentPage = this.paymentRepository.
                findByUserId(userId, pageable);

        return paymentPage.map(paymentMapper::toDTO);
    }

    private PaymentDTO createRazorpayOrder(
            Long bookingId, String userId, BigDecimal amount, String currencyCode
    ) throws RazorpayException {
        JSONObject orderRequest = new JSONObject();

        // Dynamically find the subunit factor based on the ISO-4217 currency code
        Currency currency = Currency.getInstance(currencyCode.toUpperCase());
        int fractionDigits = currency.getDefaultFractionDigits(); // e.g., INR=2, JPY=0, KWD=3

        // Calculate multiplier: 10^fractionDigits (e.g., 10^2 = 100 for INR, 10^0 = 1 for JPY)
        BigDecimal multiplier = BigDecimal.valueOf(Math.pow(10, fractionDigits));

        // 2. Convert raw amount to Razorpay's lowest subunit denomination safely
        long lowestDenominationAmount = amount
                .multiply(multiplier)
                .setScale(0, RoundingMode.HALF_UP) // Remove trailing fraction anomalies
                .longValue();

        orderRequest.put("amount", lowestDenominationAmount);
        orderRequest.put("currency", currencyCode);

        // Tag internal application states into metadata
        JSONObject metadata = new JSONObject();
        metadata.put("bookingId", bookingId);
        orderRequest.put("notes", metadata);

        Order order = this.razorpayClient.orders.create(orderRequest);

        return this.razorpayOrderMapper.toPaymentDTO(order, bookingId, userId);
    }
}
