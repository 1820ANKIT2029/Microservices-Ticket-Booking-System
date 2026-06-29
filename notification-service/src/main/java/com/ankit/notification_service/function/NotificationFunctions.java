package com.ankit.notification_service.function;

import com.ankit.notification_service.dto.NotificationEvent;
import com.ankit.notification_service.service.INotificationStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.function.Consumer;

@Configuration
@RequiredArgsConstructor
public class NotificationFunctions {

    private final List<INotificationStrategy> strategies;

    @Bean
    public Consumer<NotificationEvent> handleNotification() {
        return event -> {
            INotificationStrategy strategy = strategies.stream()
                    .filter(s -> s.supports(event.getChannel()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Unsupported channel: " + event.getChannel()
                    ));

            strategy.send(event);
        };
    }
}
