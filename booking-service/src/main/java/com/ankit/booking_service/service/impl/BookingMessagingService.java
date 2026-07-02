package com.ankit.booking_service.service.impl;

import com.ankit.booking_service.dto.NotificationEvent;
import com.ankit.booking_service.dto.PaymentEvent;
import com.ankit.booking_service.entity.Booking;
import com.ankit.booking_service.entity.BookingStatus;
import com.ankit.booking_service.entity.Ticket;
import com.ankit.booking_service.entity.TicketStatus;
import com.ankit.booking_service.exception.ResourceNotFoundException;
import com.ankit.booking_service.repository.BookingRepository;
import com.ankit.booking_service.service.IBookingMessagingService;
import com.ankit.booking_service.service.client.SessionSeatClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingMessagingService implements IBookingMessagingService {
    private final BookingRepository bookingRepository;
    private final SessionSeatClient sessionSeatClient;
    private final StreamBridge streamBridge;

    @Transactional
    public void confirmBooking(PaymentEvent event) {
        Booking booking = bookingRepository.findById(event.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Target order structure tracking missing"));

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            return; // idempotency
        }

        List<Long> sessionSeatDTOList = booking.getTickets().stream()
                .map(Ticket::getSessionSeatId)
                .toList();

        log.info("Confirming booking for booking: {}", booking);

        // Tell Event Service to book seats
        this.sessionSeatClient.bookedSeats(
                booking.getEventSessionId(),
                sessionSeatDTOList,
                booking.getUserId()
        );

        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setConfirmedAt(ZonedDateTime.now());

        booking.getTickets().forEach(ticket -> {
            ticket.setStatus(TicketStatus.ISSUED);
            ticket.setIssuedAt(ZonedDateTime.now());
        });

        bookingRepository.save(booking);

        log.info("Booking confirmed for bookingId: {}", booking.getId());

        // Send Notification
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .channel("EMAIL")
                .BookingId(booking.getId())
                .recipient(booking.getUserId())
                .templateName("booking-confirmation")
                .payload("Booking Confirmed")
                .build();
        streamBridge.send("notification-out-0", notificationEvent);
    }

    @Transactional
    public void cancelBooking(PaymentEvent paymentEvent) {
        Booking booking = bookingRepository.findById(paymentEvent.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if(booking.getStatus() == BookingStatus.CANCELLED) {
            return; // idempotency
        }

        List<Long> sessionSeatDTOList = booking.getTickets().stream()
                .map(Ticket::getSessionSeatId)
                .toList();

        // Release seats
        sessionSeatClient.unlockSeats(
                booking.getEventSessionId(),
                sessionSeatDTOList,
                booking.getUserId()
        );

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(ZonedDateTime.now());

        booking.getTickets()
                .forEach(ticket -> ticket.setStatus(TicketStatus.CANCELLED));

        bookingRepository.save(booking);

        log.info("Booking cancelled for bookingId: {}", booking.getId());

        NotificationEvent notificationEvent = NotificationEvent.builder()
                .channel("EMAIL")
                .BookingId(booking.getId())
                .recipient(booking.getUserId())
                .templateName("booking-failure")
                .payload("Booking Failed")
                .build();

        streamBridge.send("notification-out-0", notificationEvent);
    }
}
