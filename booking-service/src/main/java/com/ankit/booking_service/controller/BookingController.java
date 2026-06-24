package com.ankit.booking_service.controller;

import com.ankit.booking_service.dto.ApiResponse;
import com.ankit.booking_service.dto.BookingDTO;
import com.ankit.booking_service.dto.BookingRequestDTO;
import com.ankit.booking_service.dto.BookingResponseDTO;
import com.ankit.booking_service.service.IBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final IBookingService bookingService;

    @GetMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<BookingDTO>> getBooking(@PathVariable Long bookingId){
        BookingDTO bookingDTO = this.bookingService.getBooking(bookingId);
        return ResponseEntity.ok(
                new ApiResponse<>(
                        bookingDTO,
                        "booking details"
                )
        );
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse<BookingDTO>> createBooking(
            @RequestBody BookingRequestDTO bookingRequestDTO,
            @RequestHeader("X-User-Id") String userId
    ){
        System.out.println(bookingRequestDTO);
        bookingRequestDTO.setUserId(userId);
        BookingResponseDTO bookingDTO = this.bookingService.createBooking(bookingRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(
                        bookingDTO,
                        "booking created"
                )
        );
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<Page<BookingDTO>>> getBookingOfUser(
            @RequestHeader("X-User-Id") String userId,
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<BookingDTO> bookingPage = this.bookingService
                .getBookingsOfUser(userId, pageable);

        return ResponseEntity.ok(
                new ApiResponse<>(bookingPage, "Bookings Details")
        );
    }
}
