package com.ankit.event_service.controller;

import com.ankit.event_service.dto.ApiResponse;
import com.ankit.event_service.dto.TicketTypeDTO;
import com.ankit.event_service.service.ITicketTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ticket-type")
@RequiredArgsConstructor
public class TicketTypeController {
    final private ITicketTypeService ticketTypeService;

    @GetMapping("/{ticketTypeId}")
    public ResponseEntity<ApiResponse<TicketTypeDTO>> getTicketTypes(@PathVariable Long ticketTypeId){
        TicketTypeDTO ticketTypeDto = this.ticketTypeService.getTicketType(ticketTypeId);
        return ResponseEntity.ok(new ApiResponse<>(ticketTypeDto, "Ticket type Details"));
    }
}
