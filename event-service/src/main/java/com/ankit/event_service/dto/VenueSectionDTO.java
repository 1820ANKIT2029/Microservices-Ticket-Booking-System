package com.ankit.event_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueSectionDTO {

    private Long id;
    private Long venueId;

    @NotBlank(message = "Architectural segment zone layout tier tier name identifier is required")
    @Size(max = 255, message = "Section title tracking constraints cap parameter text at 255 characters")
    private String name;

    private String description;

    @Size(max = 100, message = "Section class category properties type tracking text cap value limit is 100 characters")
    private String sectionType;

    @PositiveOrZero(message = "Component seating matrix count fields can only express positive constraints or clean zeros")
    private Integer totalSeats;

    @PositiveOrZero(message = "Linear execution row configurations cannot yield negative parameters")
    private Integer rowCount;

    @PositiveOrZero(message = "Horizontal calculation seat indexes cannot process negative integers")
    private Integer seatsPerRow;

    @Size(max = 100, message = "Section svg Element ID properties type tracking text cap value limit is 100 characters")
    private String svgElementId;

    @Valid
    private List<SeatDTO> seats;
}