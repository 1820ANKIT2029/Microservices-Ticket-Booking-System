package com.ankit.event_service.mapper;

import com.ankit.event_service.dto.VenueSectionDTO;
import com.ankit.event_service.entity.Venue;
import com.ankit.event_service.entity.VenueSection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class VenueSectionMapper {

    private final SeatMapper seatMapper;

    public VenueSectionDTO toDto(VenueSection entity) {
        if (entity == null) return null;

        return VenueSectionDTO.builder()
                .id(entity.getId())
                .venueId(entity.getVenue().getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .sectionType(entity.getSectionType())
                .totalSeats(entity.getTotalSeats())
                .x(entity.getX())
                .y(entity.getY())
                .width(entity.getWidth())
                .height(entity.getHeight())
                .rotation(entity.getRotation())
                .seats(entity.getSeats() != null ?
                        entity.getSeats().stream()
                                .map(seatMapper::toDto)
                                .collect(Collectors.toList()) : Collections.emptyList())
                .build();
    }

    public VenueSection toEntity(VenueSectionDTO dto) {
        if (dto == null) return null;

        VenueSection section = VenueSection.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .sectionType(dto.getSectionType())
                .totalSeats(dto.getTotalSeats())
                .x(dto.getX())
                .y(dto.getY())
                .width(dto.getWidth())
                .height(dto.getHeight())
                .rotation(dto.getRotation())
                .seats(dto.getSeats() != null ?
                        dto.getSeats().stream()
                                .map(seatMapper::toEntity)
                                .collect(Collectors.toList()) : Collections.emptyList())
                .build();

        if(dto.getVenueId() != null){
            Venue venue = new Venue();
            venue.setId(dto.getVenueId());
            section.setVenue(venue);
        }

        return section;
    }
}