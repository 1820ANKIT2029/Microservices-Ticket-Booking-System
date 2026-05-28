package com.ankit.event_service.service;

import com.ankit.event_service.dto.VenueDTO;

public interface IVenueService {
    public VenueDTO createVenue(VenueDTO venueDTO);
    public VenueDTO getVenue(Long venueId);
}
