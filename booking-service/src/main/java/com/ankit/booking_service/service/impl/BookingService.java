package com.ankit.booking_service.service.impl;

import com.ankit.booking_service.dto.*;
import com.ankit.booking_service.entity.Booking;
import com.ankit.booking_service.entity.BookingStatus;
import com.ankit.booking_service.exception.ResourceNotFoundException;
import com.ankit.booking_service.mapper.BookingMapper;
import com.ankit.booking_service.mapper.BookingResponseMapper;
import com.ankit.booking_service.repository.BookingRepository;
import com.ankit.booking_service.service.IBookingService;
import com.ankit.booking_service.service.client.PaymentClient;
import com.ankit.booking_service.service.client.SessionSeatClient;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService implements IBookingService {
    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final BookingResponseMapper bookingResponseMapper;
    private final SessionSeatClient sessionSeatClient;
    private final PaymentClient paymentClient;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Override
    public BookingDTO getBooking(Long bookingId) {
        Booking booking = this.bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("No Booking Found with " + bookingId));
        return this.bookingMapper.toDto(booking);
    }

    @Override
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO bookingRequestDTO) {
        List<SessionSeatDTO> seatRequestDTOList = bookingRequestDTO.getSeats();

        List<SessionSeatDTO> sessionSeatDTOS = this.sessionSeatClient.lockSeats(seatRequestDTOList).getBody();

        assert sessionSeatDTOS != null;
        List<BigDecimal> amount = calculateTaxes(sessionSeatDTOS);

        Booking booking = Booking.builder()
                .userId(bookingRequestDTO.getUserId())
                .eventSessionId(bookingRequestDTO.getEventSessionId())
                .bookingRef(bookingRequestDTO.getBookingRef())
                .ticketCount(seatRequestDTOList.size())
                .subtotal(amount.getFirst())
                .taxAmount(amount.get(1))
                .totalAmount(amount.get(2))
                .build();

        Booking savedBooking = this.bookingRepository.save(booking);

        // TODO: Ankit: Payment Feign Client
        PaymentRequestDTO paymentRequestDTO = PaymentRequestDTO.builder()
                .userId(bookingRequestDTO.getUserId())
                .bookingId(savedBooking.getId())
                .currencyCode("INR")
                .amount(amount.get(2))
                .build();
        PaymentDTO paymentDTO = this.paymentClient.createPayment(paymentRequestDTO).getBody();

        assert paymentDTO != null;

        return this.bookingResponseMapper.toResponseDTO(booking, paymentDTO.getGatewayPublicApiKey());
    }

    private List<BigDecimal> calculateTaxes(List<SessionSeatDTO> seatRequestDTOList){
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal taxAmount;
        BigDecimal totalAmount;

        for(SessionSeatDTO seatRequestDTO : seatRequestDTOList){
            if(seatRequestDTO.getOverridePrice() != null) subtotal = subtotal.add(seatRequestDTO.getOverridePrice());
            else subtotal = subtotal.add(seatRequestDTO.getTicketType().getBasePrice());
        }

        taxAmount = subtotal.multiply(BigDecimal.valueOf(0.18));
        totalAmount = subtotal.add(taxAmount);

        return List.of(subtotal, taxAmount, totalAmount);
    }

    @KafkaListener(topics = "payment-success-topic", groupId = "booking-group")
    @Transactional
    public void confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Target order structure tracking missing"));

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        // TODO: Ankit: Send Notification
        //kafkaTemplate.send("notification", bookingId.toString());
    }
}
