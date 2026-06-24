package com.ankit.booking_service.service.client;

import com.ankit.booking_service.dto.ApiResponse;
import com.ankit.booking_service.dto.TicketTypeDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "event-service",
        contextId = "ticketTypeClient"
)
public interface TicketTypeClient {
    @GetMapping("/api/event-sessions/{eventSessionsId}/ticket-type")
    ApiResponse<Iterable<TicketTypeDTO>> getAllTicketTypesOfEventSession(
            @PathVariable Long eventSessionsId
    );
}
