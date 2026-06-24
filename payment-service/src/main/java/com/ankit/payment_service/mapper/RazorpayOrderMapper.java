package com.ankit.payment_service.mapper;

import com.ankit.payment_service.dto.PaymentDTO;
import com.ankit.payment_service.entity.PaymentGateway;
import com.ankit.payment_service.entity.PaymentStatus;
import com.razorpay.Order;
import org.json.JSONObject;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;
import java.util.Currency;

@Component
public class RazorpayOrderMapper {

    public PaymentDTO toPaymentDTO(Order order, Long bookingId, String userId) {
        if (order == null) {
            return null;
        }

        String currencyCode = order.get("currency");
        long amountInSubunit = ((Number) order.get("amount")).longValue();

        // Dynamically scale down using Java's Currency instance fraction length
        Currency currency = Currency.getInstance(currencyCode.toUpperCase());
        int fractionDigits = currency.getDefaultFractionDigits();
        BigDecimal divider = BigDecimal.valueOf(Math.pow(10, fractionDigits));

        // Reconvert back to standard human-readable display units (e.g., Rupees or Dollars)
        BigDecimal standardAmount = BigDecimal.valueOf(amountInSubunit)
                .divide(divider, fractionDigits, RoundingMode.HALF_UP);

        // Map Razorpay status string to your application's defined status lifecycle values
        // Razorpay Order statuses: created, attempted, paid
        String razorpayStatus = order.get("status");
        String appStatus = translateStatus(razorpayStatus);

        return PaymentDTO.builder()
                .gatewayName(PaymentGateway.RAZORPAY)
                .gatewayOrderId(order.get("id")) // Maps to Razorpay Order ID (e.g., order_Kjuw89...)
                .gatewayPaymentId(null)          // Order creation phase does not have a payment transaction ID yet
                .amount(standardAmount)
                .currency(order.get("currency")) // e.g., "INR"
                .status(PaymentStatus.INITIATED)
                .bookingId(bookingId)
                .userId(userId)
                .build();
    }

    /**
     * Translates Razorpay order lifecycle states into local domain business logic states.
     */
    private String translateStatus(String razorpayStatus) {
        if (razorpayStatus == null) return "INITIATED";

        return switch (razorpayStatus.toLowerCase()) {
            case "attempted" -> "PENDING";
            case "paid" -> "SUCCESS";
            default -> "INITIATED";
        };
    }
}