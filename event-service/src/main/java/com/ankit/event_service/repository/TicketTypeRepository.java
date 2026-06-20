package com.ankit.event_service.repository;

import com.ankit.event_service.entity.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType,Long> {
    List<TicketType> findAllByEventSessionId(Long eventSessionId);
    void deleteAllByEventSessionId(Long eventId);
    void deleteByIdAndEventSessionId(Long id, Long eventSessionId);
    Optional<TicketType> findByIdAndEventSessionId(Long ticketTypeId, Long eventSessionId);
}
