package com.ankit.event_service.repository;

import com.ankit.event_service.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event,Long> {
    Page<Event> findAllByUserId(String userId, Pageable pageable);
    Optional<Event> findByIdAndUserId(Long eventId, String userId);
    void deleteByIdAndUserId(Long eventId, String userId);

    @Query("""
        SELECT e
        FROM Event e
        WHERE (:#{#keyword == null} = true
               OR LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:#{#status == null} = true OR CAST(e.status AS string) = :status)
          AND (:#{#eventType == null} = true OR CAST(e.eventType AS string) = :eventType)
    """)
    Page<Event> searchEvents(
            @Param("keyword") String keyword,
            @Param("status") String status,
            @Param("eventType") String eventType,
            Pageable pageable
    );
}
