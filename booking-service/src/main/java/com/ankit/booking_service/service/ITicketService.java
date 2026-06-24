package com.ankit.booking_service.service;

import com.ankit.booking_service.dto.TicketDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ITicketService {
    public TicketDTO getTicket(Long ticketId, Long bookingId, String userId);
    public Page<TicketDTO> getTicketOfUser(
            String userId, Pageable pageable
    );
    public List<TicketDTO> getTicketsOfBooking(
            Long bookingId, String userId
    );
}
