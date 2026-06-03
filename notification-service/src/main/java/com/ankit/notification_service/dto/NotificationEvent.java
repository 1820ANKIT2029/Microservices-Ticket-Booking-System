package com.ankit.notification_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationEvent {
    private String eventId;
    private String recipient;
    private String templateName;
    private String channel; // EMAIL, SMS, PUSH
    private String payload;  // Dynamic data or message content inside JSON string
}