package com.ankit.event_service.respository;

import com.ankit.event_service.entity.Event;
import com.ankit.event_service.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VenueRepository extends JpaRepository<Venue,Long> {
}
