package com.ankit.notification_service.consumer;

import com.ankit.notification_service.dto.NotificationEvent;
import com.ankit.notification_service.service.INotificationStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationConsumer {

    private final List<INotificationStrategy> strategies;

    @KafkaListener(topics = "notification-topic", groupId = "notification-group")
    public void consumeNotification(NotificationEvent event) {

        try {
            INotificationStrategy strategy = strategies.stream()
                    .filter(s -> s.supports(event.getChannel()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Unsupported channel: " + event.getChannel()));

            strategy.send(event);

        } catch (Exception e) {
            System.out.println("Exception occurred: " + e.getMessage());
        }
    }
}