package com.ankit.booking_service.service;

import com.ankit.booking_service.dto.PaymentEvent;

public interface IBookingMessagingService {
    void confirmBooking(PaymentEvent event);
    void cancelBooking(PaymentEvent paymentEvent);
}
