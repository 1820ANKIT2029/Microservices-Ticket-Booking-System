package com.ankit.notification_service.service.impl;

import com.ankit.notification_service.dto.NotificationEvent;
import com.ankit.notification_service.service.INotificationStrategy;
import org.springframework.stereotype.Service;

@Service
public class PushNotificationStrategy implements INotificationStrategy {
    @Override
    public boolean supports(String channel) {
        return "PUSH".equalsIgnoreCase(channel);
    }

    @Override
    public void send(NotificationEvent event) {
        // mock
        System.out.println("Sending Push Notification");
        System.out.println(event);
    }
}
