package com.ankit.event_service.repository;

import com.ankit.event_service.entity.EventSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventSessionRepository extends JpaRepository<EventSession,Long> {
    Optional<EventSession> findByIdAndEventId(Long Id, Long eventId);
    void deleteByIdAndEventId(Long id, Long eventId);
    List<EventSession> findAllByEventId(Long eventId);

    @Query("""
        SELECT es
        FROM EventSession es
        JOIN es.event e
        WHERE e.userId = :userId
        ORDER BY es.startDateTime
    """)
    List<EventSession> findAllByUserId(String userId);

}
