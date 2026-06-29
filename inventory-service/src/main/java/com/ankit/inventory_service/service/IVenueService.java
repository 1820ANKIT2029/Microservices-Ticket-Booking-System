package com.ankit.inventory_service.service;

import com.ankit.inventory_service.dto.VenueDTO;
import com.ankit.inventory_service.dto.VenueSearchResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IVenueService {
    VenueDTO createVenue(VenueDTO venueDTO);
    VenueDTO getVenue(Long venueId);
    Page<VenueSearchResponse> searchVenues(String keyword, Pageable pageable);
    VenueDTO updateVenue(Long venueId, VenueDTO venueDTO);
    void deleteVenue(Long venueId);
}
