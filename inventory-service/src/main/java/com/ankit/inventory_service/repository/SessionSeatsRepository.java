package com.ankit.inventory_service.repository;

import com.ankit.inventory_service.entity.SessionSeat;
// Update this import to match your actual Enum location
import com.ankit.inventory_service.entity.SessionSeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SessionSeatsRepository extends JpaRepository<SessionSeat, Long> {

    @Modifying
    @Query("""
        UPDATE SessionSeat s
        SET s.status = :reservedStatus,
            s.lockedByUserId = :userId,
            s.lockedUntil = :expiry
        WHERE s.id IN :sessionSeatIds
        AND (s.status = :availableStatus OR s.lockedUntil < :now)
    """)
    int lockSeatsAtomic(
            @Param("sessionSeatIds") List<Long> sessionSeatIds,
            @Param("userId") String userId,
            @Param("expiry") LocalDateTime expiry,
            @Param("now") LocalDateTime now,
            @Param("reservedStatus") SessionSeatStatus reservedStatus, // Changed to Enum
            @Param("availableStatus") SessionSeatStatus availableStatus  // Changed to Enum
    );

    @Modifying
    @Query("""
        UPDATE SessionSeat s
        SET s.status = :availableStatus,
            s.lockedByUserId = null,
            s.lockedUntil = null
        WHERE s.id IN :sessionSeatIds
        AND s.status = :reservedStatus
        AND s.lockedByUserId = :userId
    """)
    int unlockReservedSeats(
            @Param("sessionSeatIds") List<Long> sessionSeatIds,
            @Param("userId") String userId,
            @Param("reservedStatus") SessionSeatStatus reservedStatus, // Changed to Enum
            @Param("availableStatus") SessionSeatStatus availableStatus  // Changed to Enum
    );

    @Modifying
    @Query("""
        UPDATE SessionSeat s
        SET s.status = :bookedStatus,
            s.lockedByUserId = null,
            s.lockedUntil = null
        WHERE s.id IN :sessionSeatIds
        AND s.status = :reservedStatus
        AND s.lockedByUserId = :userId
    """)
    int bookReservedSeats(
            @Param("sessionSeatIds") List<Long> sessionSeatIds,
            @Param("userId") String userId,
            @Param("reservedStatus") SessionSeatStatus reservedStatus, // Changed to Enum
            @Param("bookedStatus") SessionSeatStatus bookedStatus      // Changed to Enum
    );

    @Modifying
    @Query("""
        UPDATE SessionSeat s
        SET s.status = :availableStatus,
            s.lockedByUserId = null,
            s.lockedUntil = null
        WHERE s.status = :reservedStatus
        AND s.lockedUntil < :now
    """)
    int releaseExpiredSeats(
            @Param("now") LocalDateTime now,
            @Param("reservedStatus") SessionSeatStatus reservedStatus, // Changed to Enum
            @Param("availableStatus") SessionSeatStatus availableStatus  // Changed to Enum
    );

    List<SessionSeat> findAllByEventSessionId(Long eventSessionId);
}