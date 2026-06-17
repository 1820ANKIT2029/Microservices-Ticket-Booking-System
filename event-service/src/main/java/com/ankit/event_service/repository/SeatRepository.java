package com.ankit.event_service.repository;

import com.ankit.event_service.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat,Long> {
    Optional<Seat> findByIdAndVenueIdAndVenueSectionId(
            Long venueId, Long venueSectionId, Long id
    );

    List<Seat> findAllByVenueIdAndVenueSectionId(Long venueId, Long venueSectionId);
    void deleteByIdAndVenueIdAndVenueSectionId(Long id, Long venueId, Long venueSectionId);
}
