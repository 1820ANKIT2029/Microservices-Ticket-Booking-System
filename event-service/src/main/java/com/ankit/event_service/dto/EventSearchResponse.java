package com.ankit.event_service.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventSearchResponse {
    private Long id;
    private String title;
    private String slug;
    private String eventType;
    private String status;
    private String bannerUrl;
    private Boolean isFeatured;
}
