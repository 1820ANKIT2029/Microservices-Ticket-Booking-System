package com.ankit.event_service.service.impl;

import com.ankit.event_service.dto.SeatDTO;
import com.ankit.event_service.entity.Seat;
import com.ankit.event_service.exception.ResourceNotFoundException;
import com.ankit.event_service.mapper.SeatMapper;
import com.ankit.event_service.repository.SeatRepository;
import com.ankit.event_service.service.ISeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements ISeatService {
    private final SeatRepository seatRepository;
    private final SeatMapper seatMapper;

    @Override
    public SeatDTO getSeat(Long venueId, Long venueSectionId, Long seatId) {
        Seat seat = this.seatRepository
                .findByIdAndVenueIdAndVenueSectionId(venueId, venueSectionId, seatId)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found!"));
        return this.seatMapper.toDto(seat);
    }

    @Override
    public List<SeatDTO> getSeats(Long venueSectionId, Long venueId) {
        List<Seat> seats = this.seatRepository
                .findAllByVenueIdAndVenueSectionId(venueId, venueSectionId);

        return seats.stream().map(seatMapper::toDto).toList();
    }

    @Override
    public SeatDTO createSeat(Long venueSectionId, Long venueId, SeatDTO seatDTO) {
        seatDTO.setVenueId(venueId);
        seatDTO.setVenueSectionId(venueSectionId);
        Seat seat = this.seatMapper.toEntity(seatDTO);
        Seat savedSeat = this.seatRepository.save(seat);
        return this.seatMapper.toDto(savedSeat);
    }

    @Override
    public List<SeatDTO> createSeats(Long venueSectionId, Long venueId, List<SeatDTO> seatDTOS) {
        seatDTOS.forEach(seatDTO -> seatDTO.setVenueId(venueId));
        seatDTOS.forEach(seatDTO -> seatDTO.setVenueSectionId(venueSectionId));
        List<Seat> seats = seatDTOS.stream().map(seatMapper::toEntity).toList();
        List<Seat> seats1 = this.seatRepository.saveAll(seats);
        return seats1.stream().map(seatMapper::toDto).toList();
    }

    @Override
    public SeatDTO modifySeat(Long venueId, Long venueSectionId, Long seatId, SeatDTO seatDTO) {
        Seat seat = this.seatRepository
                .findByIdAndVenueIdAndVenueSectionId(venueId, venueSectionId, seatId)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found!"));

        if(seatDTO.getSeatNumber() != null) seat.setSeatNumber(seatDTO.getSeatNumber());
        if(seatDTO.getSeatType() != null) seat.setSeatType(seatDTO.getSeatType());
        if(seatDTO.getRowLabel() != null) seat.setRowLabel(seatDTO.getRowLabel());
        if(seatDTO.getX() != null) seat.setX(seatDTO.getX());
        if(seatDTO.getY() != null) seat.setY(seatDTO.getY());
        if(seatDTO.getWidth() != null) seat.setWidth(seatDTO.getWidth());
        if(seatDTO.getHeight() != null) seat.setHeight(seatDTO.getHeight());
        if(seatDTO.getRotation() != null) seat.setRotation(seatDTO.getRotation());
        if(seatDTO.getShape() != null) seat.setShape(seatDTO.getShape());
        if(seatDTO.getIsAccessible() != null) seat.setIsAccessible(seatDTO.getIsAccessible());
        if(seatDTO.getIsActive() != null) seat.setIsActive(seatDTO.getIsActive());

        Seat seat1 = this.seatRepository.save(seat);
        return this.seatMapper.toDto(seat1);
    }

    @Override
    public void deleteSeat(Long venueId, Long venueSectionId, Long seatId) {
        this.seatRepository.deleteByIdAndVenueIdAndVenueSectionId(seatId, venueId, venueSectionId);
    }
}
