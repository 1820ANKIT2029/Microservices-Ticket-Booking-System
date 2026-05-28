package com.ankit.event_service.service;

import com.ankit.event_service.dto.TicketTypeDTO;
import com.ankit.event_service.entity.TicketType;

public interface ITicketTypeService {
    TicketTypeDTO getTicketType(Long Id);
}
