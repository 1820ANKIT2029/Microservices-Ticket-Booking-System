package com.ankit.booking_service.service.impl;

import com.ankit.booking_service.dto.*;
import com.ankit.booking_service.entity.Booking;
import com.ankit.booking_service.entity.Ticket;
import com.ankit.booking_service.entity.TicketStatus;
import com.ankit.booking_service.exception.ResourceNotFoundException;
import com.ankit.booking_service.mapper.BookingMapper;
import com.ankit.booking_service.mapper.BookingResponseMapper;
import com.ankit.booking_service.repository.BookingRepository;
import com.ankit.booking_service.service.IBookingService;
import com.ankit.booking_service.service.client.PaymentClient;
import com.ankit.booking_service.service.client.SessionSeatClient;
import com.ankit.booking_service.service.client.TicketTypeClient;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BookingService implements IBookingService {
    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final BookingResponseMapper bookingResponseMapper;
    private final SessionSeatClient sessionSeatClient;
    private final PaymentClient paymentClient;
    private final TicketTypeClient ticketTypeClient;

    @Override
    public BookingDTO getBooking(Long bookingId) {
        Booking booking = this.bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("No Booking Found with " + bookingId));
        return this.bookingMapper.toDto(booking);
    }

    @Override
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO bookingRequestDTO) {
        List<SessionSeatRequest> sessionSeatRequests = bookingRequestDTO.getSeats();

        assert sessionSeatRequests != null;
        List<SessionSeatDTO> sessionSeatDTOList = sessionSeatRequests.stream()
                .map(seatRequest -> SessionSeatDTO.builder()
                        .seatId(seatRequest.getSeatId())
                        .id(seatRequest.getSessionSeatId())
                        .eventSessionId(seatRequest.getEventSessionId())
                        .build()
                )
                .toList();

        List<Long> ticketTypeIds = sessionSeatRequests.stream()
                .map(SessionSeatRequest::getTicketTypeId)
                .toList();

        // attempt to lock the seats
        this.sessionSeatClient.lockSeats(
                bookingRequestDTO.getEventSessionId(),
                sessionSeatDTOList, bookingRequestDTO.getUserId()
        );

        Iterable<TicketTypeDTO> ticketTypeDTOS = this.ticketTypeClient
                .getAllTicketTypesOfEventSession(bookingRequestDTO.getEventSessionId())
                .data();

        assert  ticketTypeDTOS != null;

        PriceSummaryDTO amount = calculateTaxes(ticketTypeIds, ticketTypeDTOS);

        Booking booking = Booking.builder()
                .userId(bookingRequestDTO.getUserId())
                .eventSessionId(bookingRequestDTO.getEventSessionId())
                .bookingRef(bookingRequestDTO.getBookingRef())
                .ticketCount(sessionSeatRequests.size())
                .subtotal(amount.getSubtotal())
                .taxAmount(amount.getTaxAmount())
                .totalAmount(amount.getTotalAmount())
                .build();

        Booking savedBooking = this.bookingRepository.save(booking);

        List<Ticket> tickets = sessionSeatRequests.stream()
                .map(request ->
                        Ticket.builder()
                                .booking(savedBooking)
                                .userId(savedBooking.getUserId())
                                .eventSessionId(savedBooking.getEventSessionId())
                                .ticketTypeId(request.getTicketTypeId())
                                .sessionSeatId(request.getSessionSeatId())
                                .pricePaid(BigDecimal.ZERO) // set later
                                .status(TicketStatus.RESERVED)
                                .build()
                )
                .toList();

        savedBooking.getTickets().addAll(tickets);

        this.bookingRepository.save(savedBooking);

        // Payment Feign Client
        PaymentRequestDTO paymentRequestDTO = PaymentRequestDTO.builder()
                .userId(bookingRequestDTO.getUserId())
                .bookingId(savedBooking.getId())
                .currencyCode("INR")
                .amount(amount.getTotalAmount())
                .build();
        PaymentDTO paymentDTO = this.paymentClient
                .createPayment(paymentRequestDTO)
                .data();

        assert paymentDTO != null;

        return this.bookingResponseMapper.toResponseDTO(
                booking, paymentDTO.getGatewayPublicApiKey(), paymentDTO.getGatewayOrderId()
        );
    }

    @Override
    public Page<BookingDTO> getBookingsOfUser(String userId, Pageable pageable) {
        Page<Booking> bookings = this.bookingRepository
                .findAllByUserId(userId, pageable);

        return bookings.map(bookingMapper::toDto);
    }

    private PriceSummaryDTO calculateTaxes(
            List<Long> ticketTypeIds,  Iterable<TicketTypeDTO> ticketTypeDTOS
    ) {
        BigDecimal subtotal = BigDecimal.ZERO;
        Map<Long, TicketTypeDTO> ticketTypeMap = new HashMap<>();

        for (TicketTypeDTO ticketTypeDTO : ticketTypeDTOS) {
            ticketTypeMap.put(ticketTypeDTO.getId(), ticketTypeDTO);
        }

        for (Long ticketTypeId : ticketTypeIds) {
            TicketTypeDTO ticketType = ticketTypeMap.get(ticketTypeId);

            if (ticketType == null) {
                throw new ResourceNotFoundException(
                        "Ticket type not found: " + ticketTypeId
                );
            }

            subtotal = subtotal.add(ticketType.getBasePrice());
        }

        BigDecimal taxAmount = subtotal.multiply(BigDecimal.valueOf(0.18));
        BigDecimal totalAmount = subtotal.add(taxAmount);

        return PriceSummaryDTO.builder()
                .subtotal(subtotal)
                .taxAmount(taxAmount)
                .totalAmount(totalAmount)
                .build();
    }
}


