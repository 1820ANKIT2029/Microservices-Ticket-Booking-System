package com.ankit.notification_service.service.impl;

import com.ankit.notification_service.dto.NotificationEvent;
import com.ankit.notification_service.service.INotificationStrategy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailNotificationStrategy implements INotificationStrategy {
    @Override
    public boolean supports(String channel) {
        return "EMAIL".equalsIgnoreCase(channel);
    }

    @Override
    public void send(NotificationEvent event) {
        // mock
        log.info("Sending Email Notification");
        log.info("Event: {}", event);
    }
}
