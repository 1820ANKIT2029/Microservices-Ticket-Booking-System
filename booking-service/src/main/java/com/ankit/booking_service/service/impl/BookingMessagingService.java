package com.ankit.booking_service.messaging;

import com.ankit.booking_service.dto.NotificationEvent;
import com.ankit.booking_service.dto.PaymentEvent;
import com.ankit.booking_service.dto.SessionSeatDTO;
import com.ankit.booking_service.entity.Booking;
import com.ankit.booking_service.entity.BookingStatus;
import com.ankit.booking_service.entity.TicketStatus;
import com.ankit.booking_service.exception.ResourceNotFoundException;
import com.ankit.booking_service.repository.BookingRepository;
import com.ankit.booking_service.service.client.SessionSeatClient;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingMessagingService {
    private final BookingRepository bookingRepository;
    private final SessionSeatClient sessionSeatClient;
    private final KafkaTemplate<String, NotificationEvent> kafkaTemplate;
    private final StreamBridge streamBridge;


//    @KafkaListener(topics = "payment-success-topic", groupId = "booking-service")
    @Transactional
    public void confirmBooking(PaymentEvent event) {
        Booking booking = bookingRepository.findById(event.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Target order structure tracking missing"));

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            return; // idempotency
        }

        List<SessionSeatDTO> sessionSeatDTOList = booking.getTickets().stream()
                .map(seatRequest -> SessionSeatDTO.builder()
                        .id(seatRequest.getSessionSeatId())
                        .eventSessionId(seatRequest.getEventSessionId())
                        .build()
                )
                .toList();

        System.out.println("sessionSeatDTOList: " + sessionSeatDTOList);
        System.out.println("booking.getUserId(): " + booking.getUserId());
        System.out.println("booking.getEventSessionId(): " + booking.getEventSessionId());
        System.out.println("booking.getTickets(): " + booking.getTickets());
        System.out.println("booking.getTickets().size(): " + booking.getTickets().size());

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

        // Send Notification
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .channel("EMAIL")
                .BookingId(booking.getId())
                .recipient(booking.getUserId())
                .templateName("booking-confirmation")
                .payload("Booking Confirmed")
                .build();
        kafkaTemplate.send("notification-topic", notificationEvent);
    }

//    @KafkaListener(topics = "payment-failure-topic", groupId = "booking-service")
    @Transactional
    public void cancelBooking(PaymentEvent paymentEvent) {
        Booking booking = bookingRepository.findById(paymentEvent.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if(booking.getStatus() == BookingStatus.CANCELLED) {
            return; // idempotency
        }

        List<SessionSeatDTO> sessionSeatDTOList = booking.getTickets().stream()
                .map(seatRequest -> SessionSeatDTO.builder()
                        .id(seatRequest.getSessionSeatId())
                        .eventSessionId(seatRequest.getEventSessionId())
                        .build()
                )
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
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .channel("EMAIL")
                .BookingId(booking.getId())
                .recipient(booking.getUserId())
                .templateName("booking-failure")
                .payload("Booking Failed")
                .build();

        kafkaTemplate.send("notification-topic", notificationEvent);
    }
}
