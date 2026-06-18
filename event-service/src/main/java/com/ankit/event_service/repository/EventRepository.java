package com.ankit.event_service.repository;

import com.ankit.event_service.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event,Long> {
    List<Event> findAllByUserId(String userId);
    Optional<Event> findByIdAndUserId(Long eventId, String userId);
    void deleteByIdAndUserId(Long eventId, String userId);
}
