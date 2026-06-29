package com.ankit.notification_service.controller;

import com.ankit.notification_service.dto.NotificationEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/notifications/test")
@RequiredArgsConstructor
public class TestNotificationProducerController {
    private final StreamBridge streamBridge;

    @PostMapping
    public String triggerNotification(@RequestBody NotificationEvent event) {
        if (event.getId() == null) {
            event.setId(UUID.randomUUID().toString());
        }

        streamBridge.send("notification-in-0", event);
        return "Notification event dispatched to Kafka successfully!";
    }
}