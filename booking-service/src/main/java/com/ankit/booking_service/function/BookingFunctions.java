package com.ankit.booking_service.function;

import com.ankit.booking_service.dto.PaymentEvent;
import com.ankit.booking_service.service.IBookingMessagingService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
@RequiredArgsConstructor
public class BookingFunctions {

    private final IBookingMessagingService bookingMessagingService;

    @Bean
    public Consumer<PaymentEvent> paymentSuccess() {
        return bookingMessagingService::confirmBooking;
    }

    @Bean
    public Consumer<PaymentEvent> paymentFailure() {
        return bookingMessagingService::cancelBooking;
    }
}
