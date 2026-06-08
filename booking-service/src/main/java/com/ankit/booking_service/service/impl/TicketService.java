package com.ankit.booking_service.service.impl;

import com.ankit.booking_service.dto.TicketDTO;
import com.ankit.booking_service.entity.Ticket;
import com.ankit.booking_service.exception.ResourceNotFoundException;
import com.ankit.booking_service.mapper.TicketMapper;
import com.ankit.booking_service.repository.TicketRepository;
import com.ankit.booking_service.service.ITicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicketService implements ITicketService {
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;


    @Override
    public TicketDTO getTicket(Long ticketId) {
        Ticket ticket = this.ticketRepository.findById(ticketId)
                .orElseThrow(()-> new ResourceNotFoundException("No Ticket Found with " + ticketId.toString()));
        return this.ticketMapper.toDto(ticket);
    }
}
