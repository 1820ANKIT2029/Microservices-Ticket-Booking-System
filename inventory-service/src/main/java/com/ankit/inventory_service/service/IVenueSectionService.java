package com.ankit.inventory_service.service;

import com.ankit.inventory_service.dto.VenueSectionDTO;

import java.util.List;

public interface IVenueSectionService {
    public VenueSectionDTO getVenueSection(
            Long venueSectionId, Long venueId
    );
    public VenueSectionDTO createVenueSection(
            VenueSectionDTO venueSectionDTO,
            Long venueId
    );
    public VenueSectionDTO updateVenueSection(
            VenueSectionDTO venueSectionDTO,
            Long venueSectionId, Long venueId
    );
    public void deleteVenueSection(
            Long venueSectionId, Long venueId
    );

    List<VenueSectionDTO> getVenueSections(Long venueId);
}
