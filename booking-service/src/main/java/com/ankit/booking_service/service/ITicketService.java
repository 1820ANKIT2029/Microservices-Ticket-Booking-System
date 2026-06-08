package com.ankit.booking_service.service;

import com.ankit.booking_service.dto.TicketDTO;

public interface ITicketService {
    public TicketDTO getTicket(Long ticketId);
}
