package com.ankit.inventory_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    private Double x;
    private Double y;
    private Double width;
    private Double height;
    @Builder.Default
    private Double rotation = 0.0;

    @Valid
    private List<SeatDTO> seats;
}