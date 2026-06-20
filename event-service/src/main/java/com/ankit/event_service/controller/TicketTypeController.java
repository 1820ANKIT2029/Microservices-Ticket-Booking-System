package com.ankit.event_service.controller;

import com.ankit.event_service.dto.ApiResponse;
import com.ankit.event_service.dto.TicketTypeDTO;
import com.ankit.event_service.service.ITicketTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/event-sessions/{eventSessionsId}/ticket-type")
@RequiredArgsConstructor
public class TicketTypeController {
    final private ITicketTypeService ticketTypeService;

    @GetMapping("/{ticketTypeId}")
    public ResponseEntity<ApiResponse<TicketTypeDTO>> getTicketTypes(
            @PathVariable Long ticketTypeId,
            @PathVariable Long eventSessionsId
    ){
        TicketTypeDTO ticketTypeDto = this.ticketTypeService
                .getTicketType(ticketTypeId, eventSessionsId);
        return ResponseEntity.ok(
                new ApiResponse<>(ticketTypeDto, "Ticket type Details")
        );
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<Iterable<TicketTypeDTO>>> getAllTicketTypesOfEventSession(
            @PathVariable Long eventSessionsId
    ){
        Iterable<TicketTypeDTO> ticketTypeDtos = this.ticketTypeService
                .getAllTicketTypesOfEventSession(eventSessionsId);
        return ResponseEntity.ok(
                new ApiResponse<>(ticketTypeDtos, "Ticket types Details")
        );
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse<TicketTypeDTO>> createTicketType(
            @RequestBody TicketTypeDTO ticketTypeDTO,
            @PathVariable Long eventSessionsId
    ){
        TicketTypeDTO ticketTypeDTO1 = this.ticketTypeService
                .createTicketType(ticketTypeDTO, eventSessionsId);
        return ResponseEntity.ok(
                new ApiResponse<>(ticketTypeDTO1, "Ticket type created")
        );
    }

    @PutMapping("/{ticketTypeId}")
    public ResponseEntity<ApiResponse<TicketTypeDTO>> modifyTicketType(
            @PathVariable Long ticketTypeId,
            @RequestBody TicketTypeDTO ticketTypeDTO,
            @PathVariable Long eventSessionsId
    ){
        TicketTypeDTO ticketTypeDTO1 = this.ticketTypeService
                .updateTicketType(ticketTypeId, ticketTypeDTO, eventSessionsId);
        return ResponseEntity.ok(
                new ApiResponse<>(ticketTypeDTO1, "Ticket type updated")
        );
    }

    @DeleteMapping("/{ticketTypeId}")
    public ResponseEntity<ApiResponse<TicketTypeDTO>> deleteTicketType(
            @PathVariable Long ticketTypeId,
            @PathVariable Long eventSessionsId
    ){
        this.ticketTypeService
                .deleteTicketType(ticketTypeId, eventSessionsId);
        return ResponseEntity.ok(
                new ApiResponse<>(null, "Ticket type deleted")
        );
    }
}
