package com.ankit.event_service.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VenueSearchResponse {
    private Long id;
    private String name;
}
