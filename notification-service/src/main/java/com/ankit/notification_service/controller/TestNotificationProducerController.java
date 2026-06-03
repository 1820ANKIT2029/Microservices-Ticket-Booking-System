package com.ankit.notification_service.controller;

import com.ankit.notification_service.dto.NotificationEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/notifications/test")
@RequiredArgsConstructor
public class TestNotificationProducerController {

    private final KafkaTemplate<String, NotificationEvent> kafkaTemplate;
    private static final String TOPIC = "notification-topic";

    @PostMapping
    public String triggerNotification(@RequestBody NotificationEvent event) {
        if (event.getEventId() == null) {
            event.setEventId(UUID.randomUUID().toString());
        }

        kafkaTemplate.send(TOPIC, event.getEventId(), event);
        return "Notification event dispatched to Kafka successfully!";
    }
}