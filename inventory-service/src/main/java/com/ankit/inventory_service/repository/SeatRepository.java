package com.ankit.inventory_service.repository;

import com.ankit.inventory_service.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat,Long> {
    Optional<Seat> findByVenueIdAndVenueSectionIdAndId(
            Long venueId, Long venueSectionId, Long id
    );

    List<Seat> findAllByVenueId(Long venueId);
    List<Seat> findAllByVenueIdAndVenueSectionId(Long venueId, Long venueSectionId);
    void deleteByVenueIdAndVenueSectionIdAndId(Long venueId, Long venueSectionId, Long seatId);
}
