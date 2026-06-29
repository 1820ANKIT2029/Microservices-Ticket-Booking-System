package com.ankit.inventory_service.function;

import com.ankit.inventory_service.dto.EventSessionEvent;
import com.ankit.inventory_service.service.ISessionSeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
@RequiredArgsConstructor
public class SessionSeatFunction {
    private final ISessionSeatService sessionSeatsService;

    @Bean
    public Consumer<EventSessionEvent> createSessionSeats() {
        return sessionSeatsService::initializeSessionSeats;
    }
}
