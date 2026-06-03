package com.ankit.notification_service.service;

import com.ankit.notification_service.dto.NotificationEvent;

public interface INotificationStrategy {
    boolean supports(String channel);
    void send(NotificationEvent event);
}
