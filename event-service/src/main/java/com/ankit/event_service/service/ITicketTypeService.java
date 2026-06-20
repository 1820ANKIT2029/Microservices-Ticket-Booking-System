package com.ankit.event_service.service;

import com.ankit.event_service.dto.TicketTypeDTO;

import java.util.List;

public interface ITicketTypeService {
    TicketTypeDTO getTicketType(Long Id, Long eventSessionId);
    List<TicketTypeDTO> getAllTicketTypesOfEventSession(Long eventSessionId);
    TicketTypeDTO createTicketType(TicketTypeDTO ticketTypeDTO, Long eventSessionId);
    void deleteTicketType(Long ticketTypeId, Long eventSessionId);
    TicketTypeDTO updateTicketType(
            Long ticketTypeId, TicketTypeDTO ticketTypeDTO, Long eventSessionId
    );
}
