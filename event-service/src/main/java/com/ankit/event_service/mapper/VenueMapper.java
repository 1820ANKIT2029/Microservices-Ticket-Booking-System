package com.ankit.event_service.mapper;

import com.ankit.event_service.dto.VenueDTO;
import com.ankit.event_service.entity.Venue;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class VenueMapper {

    private final VenueSectionMapper venueSectionMapper;

    public VenueDTO toDto(Venue entity) {
        if (entity == null) return null;

        return VenueDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .addressLine1(entity.getAddressLine1())
                .city(entity.getCity())
                .state(entity.getState())
                .country(entity.getCountry())
                .postalCode(entity.getPostalCode())
                .longitude(entity.getLongitude())
                .latitude(entity.getLatitude())
                .timezone(entity.getTimezone())
                .totalCapacity(entity.getTotalCapacity())
                .websiteUrl(entity.getWebsiteUrl())
                .mapHeight(entity.getMapHeight())
                .mapWidth(entity.getMapWidth())
                .amenities(entity.getAmenities())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .sections(entity.getSections() != null ?
                        entity.getSections().stream().map(venueSectionMapper::toDto).collect(Collectors.toList()) : Collections.emptyList())
                .build();
    }

    public Venue toEntity(VenueDTO dto) {
        if (dto == null) return null;

        return Venue.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .addressLine1(dto.getAddressLine1())
                .city(dto.getCity())
                .state(dto.getState())
                .country(dto.getCountry())
                .postalCode(dto.getPostalCode())
                .longitude(dto.getLongitude())
                .latitude(dto.getLatitude())
                .timezone(dto.getTimezone())
                .totalCapacity(dto.getTotalCapacity())
                .websiteUrl(dto.getWebsiteUrl())
                .mapHeight(dto.getMapHeight())
                .mapWidth(dto.getMapWidth())
                .amenities(dto.getAmenities())
                .isActive(dto.getIsActive())
                .createdAt(dto.getCreatedAt())
                .sections(dto.getSections() != null ?
                        dto.getSections().stream().map(venueSectionMapper::toEntity).collect(Collectors.toList()) : Collections.emptyList())
                .build();
    }
}