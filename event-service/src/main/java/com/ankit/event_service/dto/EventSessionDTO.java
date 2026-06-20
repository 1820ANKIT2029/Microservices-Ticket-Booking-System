package com.ankit.event_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.ZonedDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventSessionDTO {

    private Long id;

    private Long eventId;
    private Long venueId;

    @NotBlank(message = "Session title is required")
    @Size(max = 255, message = "Session title must not exceed 255 characters")
    private String title;

    private String description;

    @Size(max = 50, message = "Session status must not exceed 50 characters")
    private String status;

    @Size(max = 2048, message = "Stream URL must not exceed 2048 characters")
    @Pattern(regexp = "^(https?://.*)?$", message = "Stream URL must be a valid HTTP or HTTPS address")
    private String streamUrl;

    @Size(max = 100, message = "Language label must not exceed 100 characters")
    private String language;

    @PositiveOrZero(message = "Total capacity cannot be negative")
    private Integer totalCapacity;

    @PositiveOrZero(message = "Available capacity cannot be negative")
    private Integer availableCapacity;

    @NotNull(message = "Session sequence number is required")
    @Positive(message = "Session number must be greater than zero")
    private Integer sessionNumber;

    private Boolean isRecorded;
    private ZonedDateTime startDataTime;
    private ZonedDateTime endDataTime;
    private ZonedDateTime createdAt;

    @Valid
    private List<TicketTypeDTO> ticketTypes;
}