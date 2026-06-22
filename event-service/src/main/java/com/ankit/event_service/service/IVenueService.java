package com.ankit.event_service.service;

import com.ankit.event_service.dto.VenueDTO;
import com.ankit.event_service.dto.VenueSearchResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IVenueService {
    VenueDTO createVenue(VenueDTO venueDTO);
    VenueDTO getVenue(Long venueId);
    Page<VenueSearchResponse> searchVenues(String keyword, Pageable pageable);
    VenueDTO updateVenue(Long venueId, VenueDTO venueDTO);
    void deleteVenue(Long venueId);
}
