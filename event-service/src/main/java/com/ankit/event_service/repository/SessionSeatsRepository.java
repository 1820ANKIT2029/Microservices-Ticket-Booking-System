package com.ankit.event_service.repository;

import com.ankit.event_service.entity.SessionSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface SessionSeatsRepository extends JpaRepository<SessionSeat, Long> {

    @Modifying
    @Query("""
        UPDATE SessionSeat s
        SET s.status = 'RESERVED',
            s.lockedByUserId = :userId,
            s.lockedUntil = :expiry
        WHERE s.id IN :sessionSeatIds
        AND s.status = 'AVAILABLE'
    """)
    int lockAvailableSeats(
            List<Long> sessionSeatIds,
            String userId,
            LocalDateTime expiry
    );

    @Modifying
    @Query("""
        UPDATE SessionSeat s
        SET s.status = 'AVAILABLE',
            s.lockedByUserId = null,
            s.lockedUntil = null
        WHERE s.id IN :sessionSeatIds
        AND s.status = 'RESERVED'
        AND s.lockedByUserId = :userId
    """)
    int unlockReservedSeats(
            List<Long> sessionSeatIds,
            String userId
    );

    @Modifying
    @Query("""
        UPDATE SessionSeat s
        SET s.status = 'AVAILABLE',
            s.lockedByUserId = null,
            s.lockedUntil = null
        WHERE s.status = 'RESERVED'
        AND s.lockedUntil < :now
    """)
    int releaseExpiredSeats(LocalDateTime now);

    List<SessionSeat> findAllByEventSessionId(Long eventSessionId);
}
