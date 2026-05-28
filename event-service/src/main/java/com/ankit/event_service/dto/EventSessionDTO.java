package com.ankit.event_service.dto;

import lombok.*;
import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventSessionDTO {
    private Long id;
    private Long eventId; // Prevent deep circular nesting back to Event
    private Long venueId;
    private String title;
    private String description;
    private String status;
    private String streamUrl;
    private String language;
    private Integer totalCapacity;
    private Integer availableCapacity;
    private Integer sessionNumber;
    private Boolean isRecorded;
    private ZonedDateTime startDataTime; // Keeping variable naming consistent with your Entity
    private ZonedDateTime endDataTime;
    private ZonedDateTime createdAt;
}