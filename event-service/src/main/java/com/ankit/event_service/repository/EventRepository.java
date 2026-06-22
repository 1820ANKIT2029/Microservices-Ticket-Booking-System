package com.ankit.event_service.repository;

import com.ankit.event_service.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event,Long> {
    Page<Event> findAllByUserId(String userId, Pageable pageable);
    Optional<Event> findByIdAndUserId(Long eventId, String userId);
    void deleteByIdAndUserId(Long eventId, String userId);

    @Query("SELECT e FROM Event e WHERE " +
            "(:keyword IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:status IS NULL OR e.status = :status) " +
            "AND (:eventType IS NULL OR e.eventType = :eventType)")
    Page<Event> searchEvents(
            @Param("keyword") String keyword,
            @Param("status") String status,
            @Param("eventType") String eventType,
            Pageable pageable
    );
}
