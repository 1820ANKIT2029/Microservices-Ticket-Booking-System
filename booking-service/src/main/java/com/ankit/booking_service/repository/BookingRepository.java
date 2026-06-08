package com.ankit.booking_service.repository;

import com.ankit.booking_service.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking,Long> {
}
