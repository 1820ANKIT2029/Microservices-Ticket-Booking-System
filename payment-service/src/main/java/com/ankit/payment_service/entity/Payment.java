package com.ankit.payment_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "gateway_name", nullable = false, length = 100)
    private String gatewayName; // e.g., STRIPE, PAYPAL

    @Column(name = "gateway_payment_id", unique = true, length = 255)
    private String gatewayPaymentId;

    @Column(name = "gateway_order_id", length = 255)
    private String gatewayOrderId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(length = 10)
    private String currency = "INR";

    @Column(nullable = false, length = 50)
    private String status; // e.g., INITIATED, SUCCESS, FAILED

    @Column(length = 50)
    private String method;

    @Column(name = "gateway_response", columnDefinition = "TEXT")
    private String gatewayResponse;

    @Column(name = "booking_id", nullable = false)
    private Long bookingId; // Logical decentralized link to Booking Service

    @Column(name = "user_id", nullable = false, length = 100)
    private Long userId; // Logical decentralized link to User Service

    @Column(name = "completed_id", length = 100)
    private String completedId;

    @CreationTimestamp
    @Column(name = "initiated_at", nullable = false, updatable = false)
    private ZonedDateTime initiatedAt;
}