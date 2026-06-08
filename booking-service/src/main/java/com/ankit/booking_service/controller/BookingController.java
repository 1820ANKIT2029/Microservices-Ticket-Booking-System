package com.ankit.booking_service.controller;

import com.ankit.booking_service.dto.BookingDTO;
import com.ankit.booking_service.dto.BookingRequestDTO;
import com.ankit.booking_service.dto.BookingResponseDTO;
import com.ankit.booking_service.service.IBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingController {
    private final IBookingService bookingService;

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDTO> getBooking(@PathVariable Long bookingId){
        BookingDTO bookingDTO = this.bookingService.getBooking(bookingId);
        return ResponseEntity.ok(bookingDTO);
    }

    @PostMapping("")
    public ResponseEntity<BookingResponseDTO> createBooking(BookingRequestDTO bookingRequestDTO){
        BookingResponseDTO bookingDTO = this.bookingService.createBooking(bookingRequestDTO);
        return ResponseEntity.ok(bookingDTO);
    }
}
