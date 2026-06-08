package com.ankit.booking_service.repository;

import com.ankit.booking_service.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket,Long> {
}
