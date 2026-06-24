package com.ankit.payment_service.repository;

import com.ankit.payment_service.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long> {
    Optional<Payment> findByGatewayOrderId(String gatewayOrderId);
    Optional<Payment> findByGatewayPaymentId(String gatewayPaymentId);

    Page<Payment> findByUserId(
            String userId, Pageable pageable
    );

    Optional<Payment> findAllByIdAndUserId(
            Long id, String userId
    );
}
