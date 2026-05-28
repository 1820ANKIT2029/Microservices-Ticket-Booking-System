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

@Service
@RequiredArgsConstructor
public class VenueServiceImpl implements IVenueService {
    final private VenueRepository venueRepository;
    private final VenueMapper venueMapper;

    @Override
    @Transactional
    public VenueDTO createVenue(VenueDTO venueDTO) {
        Venue venue = this.venueMapper.toEntity(venueDTO);
        if(venue.getSections() != null) {
            venue.getSections().forEach(section -> {
                section.setVenue(venue);

                if (section.getSeats() != null) {
                    section.getSeats().forEach(seat -> {
                        seat.setVenueSection(section);
                        seat.setVenue(venue);
                    });
                }
            });
        }
        Venue savedVenue = this.venueRepository.save(venue);
        return this.venueMapper.toDto(savedVenue);
    }

    @Override
    public VenueDTO getVenue(Long venueId) {
        Venue venue = this.venueRepository.findById(venueId)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found"));

        return this.venueMapper.toDto(venue);
    }

}
