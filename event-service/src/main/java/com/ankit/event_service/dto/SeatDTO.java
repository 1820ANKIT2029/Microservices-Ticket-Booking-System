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

    @Size(max = 100, message = "Section svg Element ID properties type tracking text cap value limit is 100 characters")
    private String svgElementId;

    private Boolean isAccessible;
    private Boolean isActive;
}