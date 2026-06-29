package com.ankit.inventory_service.service.impl;

import com.ankit.inventory_service.dto.VenueSectionDTO;
import com.ankit.inventory_service.entity.VenueSection;
import com.ankit.inventory_service.exception.ResourceNotFoundException;
import com.ankit.inventory_service.mapper.VenueSectionMapper;
import com.ankit.inventory_service.repository.VenueSectionRepository;
import com.ankit.inventory_service.service.IVenueSectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueSectionServiceImpl implements IVenueSectionService {
    private final VenueSectionRepository venueSectionRepository;
    private final VenueSectionMapper venueSectionMapper;

    @Override
    public VenueSectionDTO getVenueSection(
            Long venueSectionId, Long venueId
    ) {
        VenueSection venueSection = this.venueSectionRepository
                .findByIdAndVenueId(venueSectionId, venueId)
                .orElseThrow(() -> new ResourceNotFoundException("Venue Section not found"));
        return this.venueSectionMapper.toDto(venueSection);
    }

    @Override
    public VenueSectionDTO createVenueSection(
            VenueSectionDTO venueSectionDTO, Long venueId
    ) {
        venueSectionDTO.setVenueId(venueId);
        VenueSection venueSection = this.venueSectionMapper.toEntity(venueSectionDTO);
        VenueSection venueSection1 = this.venueSectionRepository.save(venueSection);
        return this.venueSectionMapper.toDto(venueSection1);
    }

    @Override
    public VenueSectionDTO updateVenueSection(
            VenueSectionDTO venueSectionDTO, Long venueSectionId, Long venueId
    ) {
        VenueSection venueSection = this.venueSectionRepository
                .findByIdAndVenueId(venueSectionId, venueId)
                .orElseThrow(() -> new ResourceNotFoundException("Venue Section not found"));

        if(venueSectionDTO.getName() != null) venueSection.setName(venueSectionDTO.getName());
        if(venueSectionDTO.getDescription() != null) venueSection.setDescription(venueSectionDTO.getDescription());
        if(venueSectionDTO.getSectionType() != null) venueSection.setSectionType(venueSectionDTO.getSectionType());
        if(venueSectionDTO.getTotalSeats() != null) venueSection.setTotalSeats(venueSectionDTO.getTotalSeats());
        if(venueSectionDTO.getX() != null) venueSection.setX(venueSectionDTO.getX());
        if(venueSectionDTO.getY() != null) venueSection.setY(venueSectionDTO.getY());
        if(venueSectionDTO.getWidth() != null) venueSection.setWidth(venueSectionDTO.getWidth());
        if(venueSectionDTO.getHeight() != null) venueSection.setHeight(venueSectionDTO.getHeight());
        if(venueSectionDTO.getRotation() != null) venueSection.setRotation(venueSectionDTO.getRotation());

        VenueSection venueSection1 = this.venueSectionRepository.save(venueSection);
        return this.venueSectionMapper.toDto(venueSection1);
    }

    @Override
    @Transactional
    public void deleteVenueSection(
            Long venueSectionId, Long venueId
    ) {
        this.venueSectionRepository.deleteByIdAndVenueId(venueSectionId, venueId);
    }

    @Override
    public List<VenueSectionDTO> getVenueSections(Long venueId) {
        List<VenueSection> venueSections = this.venueSectionRepository.findAllByVenueId(venueId);
        return venueSections.stream().map(venueSectionMapper::toDto).toList();
    }
}
