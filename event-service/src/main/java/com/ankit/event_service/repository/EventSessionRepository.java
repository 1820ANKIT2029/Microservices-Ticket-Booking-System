package com.ankit.event_service.respository;

import com.ankit.event_service.entity.Event;
import com.ankit.event_service.entity.EventSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventSessionRepository extends JpaRepository<EventSession,Long> {
}
