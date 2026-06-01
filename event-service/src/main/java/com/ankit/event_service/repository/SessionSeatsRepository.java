package com.ankit.event_service.repository;

import com.ankit.event_service.entity.SessionSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SessionSeatsRepository extends JpaRepository<SessionSeat, Long> {
    @Modifying
    @Query("UPDATE SessionSeat s SET s.status = 'RESERVED' WHERE s.id IN :seatIds AND s.status = 'AVAILABLE'")
    int lockAvailableSeats(@Param("seatIds") List<Long> seatIds);
}
