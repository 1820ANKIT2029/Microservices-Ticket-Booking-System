package com.ankit.booking_service.service.client;

import com.ankit.booking_service.dto.SessionSeatDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@FeignClient(
        name = "event-service",
        path = "/api/session-seats"
)
public interface SessionSeatClient {
    @GetMapping("/batch/lock")
    public ResponseEntity<List<SessionSeatDTO>> lockSeats(@RequestBody List<SessionSeatDTO> sessionSeats);
}
