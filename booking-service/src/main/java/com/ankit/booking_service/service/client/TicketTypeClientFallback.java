package com.ankit.booking_service.service.client;

import com.ankit.booking_service.dto.ApiResponse;
import com.ankit.booking_service.dto.TicketTypeDTO;
import org.springframework.stereotype.Component;

@Component
public class TicketTypeClientFallback implements TicketTypeClient{
    @Override
    public ApiResponse<Iterable<TicketTypeDTO>> getAllTicketTypesOfEventSession(Long eventSessionsId) {
        throw new RuntimeException(
                "Event service unavailable: Ticket Type"
        );
    }
}
