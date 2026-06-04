package com.ankit.event_service.controller;

import com.ankit.event_service.dto.TicketTypeDTO;
import com.ankit.event_service.service.ITicketTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickettype")
@RequiredArgsConstructor
public class TicketTypeController {
    final private ITicketTypeService ticketTypeService;

    @GetMapping("/{ticketTypeId}")
    public ResponseEntity<TicketTypeDTO> getTicketTypes(@PathVariable Long ticketTypeId){
        TicketTypeDTO ticketTypeDto = this.ticketTypeService.getTicketType(ticketTypeId);
        return new ResponseEntity<>(ticketTypeDto, HttpStatus.OK);
    }
}
