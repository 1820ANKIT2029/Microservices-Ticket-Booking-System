package com.ankit.event_service.service;

import com.ankit.event_service.dto.SeatDTO;

import java.util.List;

public interface ISeatService {
    SeatDTO getSeat(Long venueId, Long venueSectionId, Long seatId);
    List<SeatDTO> getSeats(Long venueSectionId, Long venueId);
    SeatDTO createSeat(
            Long venueSectionId, Long venueId, SeatDTO seatDTO
    );
    List<SeatDTO> createSeats(
            Long venueSectionId, Long venueId, List<SeatDTO> seatDTOS
    );
    SeatDTO modifySeat(Long venueId, Long venueSectionId, Long seatId, SeatDTO seatDTO);
    void deleteSeat(Long venueId, Long venueSectionId, Long seatId);
}
