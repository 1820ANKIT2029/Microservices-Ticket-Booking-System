package com.ankit.booking_service.controller;

import com.ankit.booking_service.dto.TicketDTO;
import com.ankit.booking_service.service.ITicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ticket")
@RequiredArgsConstructor
public class TicketController {
    private final ITicketService ticketService;

    @GetMapping("/{ticketId}")
    public ResponseEntity<TicketDTO> getTicket(@PathVariable Long ticketId){
        TicketDTO ticketDTO = this.ticketService.getTicket(ticketId);
        return ResponseEntity.ok(ticketDTO);
    }
}
