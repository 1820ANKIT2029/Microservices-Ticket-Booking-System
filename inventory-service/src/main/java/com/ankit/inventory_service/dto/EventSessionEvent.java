package com.ankit.inventory_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventSessionEvent {
    private Long id;
    private Long eventId;
    private Long venueId;
}