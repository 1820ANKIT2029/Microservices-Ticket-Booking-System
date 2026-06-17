package com.ankit.event_service.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatDTO {

    private Long id;
    private Long venueSectionId;
    private Long venueId;

    @NotBlank(message = "Unique alphanumeric allocation sequence placement seat marking is required")
    @Size(max = 50, message = "Seat code identification parameters cap tracking constraints at 50 characters")
    private String seatNumber;

    @Size(max = 50, message = "Structural component mapping layout row sequence label indicators max scale size tracking is 50 characters")
    private String rowLabel;

    @Size(max = 100, message = "Component structural dynamic class categorizations scale limits set text boundaries to 100 characters maximum")
    private String seatType;

    private Double x;
    private Double y;
    @Builder.Default
    private Double width = 24.0;
    @Builder.Default
    private Double height = 24.0;
    @Builder.Default
    private Double rotation = 0.0;
    @Builder.Default
    private String shape = "circle";

    private Boolean isAccessible;
    private Boolean isActive;
}