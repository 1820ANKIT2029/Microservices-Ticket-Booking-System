package com.ankit.booking_service.controller;

import com.ankit.booking_service.dto.ApiResponse;
import com.ankit.booking_service.dto.TicketDTO;
import com.ankit.booking_service.service.ITicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings/{bookingId}/tickets")
@RequiredArgsConstructor
public class TicketController {
    private final ITicketService ticketService;

    @GetMapping("/{ticketId}")
    public ResponseEntity<ApiResponse<TicketDTO>> getTicket(
            @PathVariable Long ticketId,
            @RequestHeader("X-User-Id") String userId,
            @PathVariable Long bookingId
    ){
        TicketDTO ticketDTO = this.ticketService.getTicket(ticketId, bookingId, userId);
        return ResponseEntity.ok(new ApiResponse<>(ticketDTO, "ticket details"));
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<Iterable<TicketDTO>>> getTicketsOfBooking(
            @PathVariable Long bookingId,
            @RequestHeader("X-User-Id") String userId
    ){
        Iterable<TicketDTO> ticketDTO = this.ticketService.getTicketsOfBooking(bookingId, userId);
        return ResponseEntity.ok(new ApiResponse<>(ticketDTO, "tickets details"));
    }
}
