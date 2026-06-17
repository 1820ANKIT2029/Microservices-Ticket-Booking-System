package com.ankit.event_service.service;

import com.ankit.event_service.dto.VenueDTO;

import java.util.List;

public interface IVenueService {
    VenueDTO createVenue(VenueDTO venueDTO);
    VenueDTO getVenue(Long venueId);
    List<VenueDTO> getAllVenues();
    VenueDTO updateVenue(Long venueId, VenueDTO venueDTO);
    void deleteVenue(Long venueId);
}
