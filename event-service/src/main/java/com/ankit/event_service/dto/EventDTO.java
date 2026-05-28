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
public class EventDTO {

    private Long id;

    @NotBlank(message = "Event title is required")
    @Size(max = 255, message = "Event title must not exceed 255 characters")
    private String title;

    @NotBlank(message = "Event slug is required")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug must be lowercase alphanumeric characters and hyphens only")
    @Size(max = 255, message = "Slug must not exceed 255 characters")
    private String slug;

    private String description;
    private String status;
    private String eventType;
    private Integer minAge;

    @NotNull(message = "Venue ID allocation is required")
    private Long venueId;

    @Size(max = 2048, message = "Banner URL must not exceed 2048 characters")
    @Pattern(regexp = "^(https?://.*)?$", message = "Banner URL must be a valid HTTP or HTTPS address")
    private String bannerUrl;

    @Size(max = 2048, message = "Poster URL must not exceed 2048 characters")
    @Pattern(regexp = "^(https?://.*)?$", message = "Poster URL must be a valid HTTP or HTTPS address")
    private String posterUrl;

    private Boolean isMultiSession;
    private Boolean isFeatured;

    @NotNull(message = "Creator ID reference tracking is required")
    private Long createdBy;

    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    // Deep object validation triggers cascading evaluations
    @Valid
    private List<PerformerDTO> performers;

    @Valid
    private List<EventSessionDTO> sessions;

    @Valid
    private List<TicketTypeDTO> ticketTypes;
}