package com.ankit.booking_service.service.impl;

import com.ankit.booking_service.dto.TicketDTO;
import com.ankit.booking_service.entity.Ticket;
import com.ankit.booking_service.exception.ResourceNotFoundException;
import com.ankit.booking_service.mapper.TicketMapper;
import com.ankit.booking_service.repository.TicketRepository;
import com.ankit.booking_service.service.ITicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService implements ITicketService {
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;


    @Override
    public TicketDTO getTicket(Long ticketId, Long bookingId, String userId) {
        Ticket ticket = this.ticketRepository
                .findByIdAndBookingIdAndUserId(ticketId, bookingId, userId)
                .orElseThrow(()-> new ResourceNotFoundException("No Ticket Found with " + ticketId.toString()));

        return this.ticketMapper.toDto(ticket);
    }

    @Override
    public Page<TicketDTO> getTicketOfUser(String userId, Pageable pageable) {
        Page<Ticket> ticketList = this.ticketRepository
                .findAllByUserId(userId, pageable);

        return ticketList.map(ticketMapper::toDto);
    }

    @Override
    public List<TicketDTO> getTicketsOfBooking(Long bookingId, String userId) {
        List<Ticket> ticketList = this.ticketRepository
                .findAllByBookingIdAndUserId(bookingId, userId);

        if(ticketList != null) return ticketList.stream().map(ticketMapper::toDto).toList();
        return List.of();
    }
}
