package com.ankit.event_service.service.impl;

import com.ankit.event_service.dto.VenueDTO;
import com.ankit.event_service.entity.Venue;
import com.ankit.event_service.exception.ResourceNotFoundException;
import com.ankit.event_service.mapper.VenueMapper;
import com.ankit.event_service.repository.VenueRepository;
import com.ankit.event_service.service.IVenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueServiceImpl implements IVenueService {
    final private VenueRepository venueRepository;
    private final VenueMapper venueMapper;

    @Override
    @Transactional
    public VenueDTO createVenue(VenueDTO venueDTO) {
        Venue venue = this.venueMapper.toEntity(venueDTO);
        Venue savedVenue = this.venueRepository.save(venue);
        return this.venueMapper.toDto(savedVenue);
    }

    @Override
    public VenueDTO getVenue(Long venueId) {
        Venue venue = this.venueRepository.findById(venueId)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found"));

        return this.venueMapper.toDto(venue);
    }

    @Override
    public List<VenueDTO> getAllVenues() {
        List<Venue> venues = this.venueRepository.findAll();
        if(!venues.isEmpty()) return venues.stream().map(venueMapper::toDto).toList();
        return List.of();
    }

    @Override
    @Transactional
    public VenueDTO updateVenue(Long venueId, VenueDTO venueDTO) {
        Venue venue = this.venueRepository.findById(venueId)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found"));

        if(venueDTO.getName() != null) venue.setName(venueDTO.getName());
        if(venueDTO.getDescription() != null) venue.setDescription(venueDTO.getDescription());
        if(venueDTO.getIsActive() != null) venue.setIsActive(venueDTO.getIsActive());
        if(venueDTO.getAddressLine1() != null) venue.setAddressLine1(venueDTO.getAddressLine1());
        if(venueDTO.getCity() != null) venue.setCity(venueDTO.getCity());
        if(venueDTO.getState() != null) venue.setState(venueDTO.getState());
        if(venueDTO.getCountry() != null) venue.setCountry(venueDTO.getCountry());
        if(venueDTO.getPostalCode() != null) venue.setPostalCode(venueDTO.getPostalCode());
        if(venueDTO.getLongitude() != null) venue.setLongitude(venueDTO.getLongitude());
        if(venueDTO.getLatitude() != null) venue.setLatitude(venueDTO.getLatitude());
        if(venueDTO.getTimezone() != null) venue.setTimezone(venueDTO.getTimezone());
        if(venueDTO.getTotalCapacity() != null) venue.setTotalCapacity(venueDTO.getTotalCapacity());
        if(venueDTO.getWebsiteUrl() != null) venue.setWebsiteUrl(venueDTO.getWebsiteUrl());
        if(venueDTO.getMapHeight() != null) venue.setMapHeight(venueDTO.getMapHeight());
        if(venueDTO.getMapWidth() != null) venue.setMapWidth(venueDTO.getMapWidth());
        if(venueDTO.getAmenities() != null) venue.setAmenities(venueDTO.getAmenities());
        if(venueDTO.getWebsiteUrl() != null) venue.setWebsiteUrl(venueDTO.getWebsiteUrl());

        Venue venue1 = this.venueRepository.save(venue);
        return this.venueMapper.toDto(venue1);
    }

    @Override
    @Transactional
    public void deleteVenue(Long venueId) {
        this.venueRepository.deleteById(venueId);
    }

}
