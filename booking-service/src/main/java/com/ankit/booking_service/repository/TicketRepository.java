package com.ankit.booking_service.repository;

import com.ankit.booking_service.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket,Long> {
    Optional<Ticket> findByIdAndBookingIdAndUserId(Long Id, Long BookingId, String userId);
    List<Ticket> findAllByBookingIdAndUserId(Long bookingId, String userId);
    Page<Ticket> findAllByUserId(String userId, Pageable pageable);
}
