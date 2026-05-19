package com.ankit.payment_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_methods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String type; // e.g., CREDIT_CARD, GOOGLE_PAY, APPLE_PAY

    @Column(name = "gateway_customer_id", length = 255)
    private String gatewayCustomerId;

    @Column(name = "gateway_token_id", length = 255)
    private String gatewayTokenId;

    @Column(length = 50)
    private String brand; // e.g., Visa, Mastercard

    @Column(length = 4)
    private String last4;

    @Column(name = "expiry_year")
    private Integer expiryYear;

    @Column(name = "is_default")
    private Boolean isDefault = false;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "user_id", nullable = false, length = 100)
    private String userId; // Logical decentralized link to User Service

    @Column(name = "created_id", nullable = false, length = 100)
    private String createdId;
}
