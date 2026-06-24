package com.ankit.booking_service.service;

import com.ankit.booking_service.dto.BookingDTO;
import com.ankit.booking_service.dto.BookingRequestDTO;
import com.ankit.booking_service.dto.BookingResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IBookingService {
    public BookingDTO getBooking(Long bookingId);
    public BookingResponseDTO createBooking(
            BookingRequestDTO bookingRequestDTO
    );
    public Page<BookingDTO> getBookingsOfUser(
            String userId, Pageable pageable
    );
}
