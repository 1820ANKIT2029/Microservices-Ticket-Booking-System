package com.ankit.inventory_service.repository;

import com.ankit.inventory_service.entity.VenueSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VenueSectionRepository extends JpaRepository<VenueSection,Long> {
    Optional<VenueSection> findByIdAndVenueId(Long id, Long venueId);
    void deleteByIdAndVenueId(Long id, Long venueId);
    List<VenueSection> findAllByVenueId(Long venueId);
}
