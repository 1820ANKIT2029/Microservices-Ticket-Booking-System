package com.ankit.payment_service.service;

import com.ankit.payment_service.dto.BookingRequestDTO;
import com.ankit.payment_service.dto.PaymentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IPaymentService {
    PaymentDTO createPayment(BookingRequestDTO bookingRequestDTO);
    PaymentDTO getPayment(Long paymentId, String userId);
    Page<PaymentDTO> getPaymentsOfUser(String userId, Pageable pageable);
}
