package com.ankit.event_service.repository;

import com.ankit.event_service.entity.Venue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VenueRepository extends JpaRepository<Venue,Long> {
    Page<Venue> findAll(Pageable pageable);
    Page<Venue> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
