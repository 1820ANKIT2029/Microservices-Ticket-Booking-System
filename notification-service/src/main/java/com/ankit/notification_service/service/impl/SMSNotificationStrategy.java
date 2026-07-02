package com.ankit.notification_service.service.impl;

import com.ankit.notification_service.dto.NotificationEvent;
import com.ankit.notification_service.service.INotificationStrategy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class SMSNotificationStrategy implements INotificationStrategy {
    @Override
    public boolean supports(String channel) {
        return "SMS".equalsIgnoreCase(channel);
    }

    @Override
    public void send(NotificationEvent event) {
        // mock
        log.info("Sending SMS Notification");
        log.info("Event: {}", event);
    }
}
