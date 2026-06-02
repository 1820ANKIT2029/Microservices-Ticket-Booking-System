package com.ankit.payment_service.service;

import com.ankit.payment_service.dto.BookingRequestDTO;
import com.ankit.payment_service.dto.PaymentDTO;

public interface IPaymentService {
    public PaymentDTO createPayment(BookingRequestDTO bookingRequestDTO);
}
