package com.ankit.event_service.service.impl;

import com.ankit.event_service.dto.SessionSeatDTO;
import com.ankit.event_service.entity.EventSession;
import com.ankit.event_service.entity.Seat;
import com.ankit.event_service.entity.SessionSeat;
import com.ankit.event_service.entity.SessionSeatStatus;
import com.ankit.event_service.exception.ResourceNotFoundException;
import com.ankit.event_service.exception.SeatAlreadyBookedException;
import com.ankit.event_service.mapper.SessionSeatMapper;
import com.ankit.event_service.repository.SeatRepository;
import com.ankit.event_service.repository.SessionSeatsRepository;
import com.ankit.event_service.service.ISessionSeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionSeatServiceImpl implements ISessionSeatService {
    private final SessionSeatsRepository sessionSeatsRepository;
    private final SeatRepository seatRepository;
    private final SessionSeatMapper sessionSeatMapper;

    @Override
    public SessionSeatDTO getSessionSeat(Long sessionSeatId) {
        SessionSeat sessionSeat = this.sessionSeatsRepository
                .findById(sessionSeatId)
                .orElseThrow(() -> new ResourceNotFoundException("Session Seat not Found"));
        return this.sessionSeatMapper.toDto(sessionSeat);
    }

    @Override
    public List<SessionSeatDTO> getSessionSeats(Long eventSessionId) {
        List<SessionSeat> sessionSeats = this.sessionSeatsRepository
                .findAllByEventSessionId(eventSessionId);
        if(!sessionSeats.isEmpty()) return sessionSeats.stream().map(sessionSeatMapper::toDto).toList();
        return List.of();
    }


    @Override
    @Transactional // Ankit: this ensures that the database transaction is rolled back if any error occurs
    public void lockSessionSeats(List<SessionSeatDTO> sessionSeatsDTO, String userId) {
        List<Long> idsToLock = sessionSeatsDTO.stream()
                .map(SessionSeatDTO::getId)
                .toList();

        LocalDateTime tilDate = LocalDateTime.now().plusMinutes(10);

        int updatedCount = sessionSeatsRepository
                .lockAvailableSeats(idsToLock, userId, tilDate);

        // Ankit: roll back the transaction if any seat is not available
        if (updatedCount != idsToLock.size()) {
            throw new SeatAlreadyBookedException("One or more selected seats are no longer available.");
        }
    }

    @Override
    public void unlockSessionSeats(
            List<SessionSeatDTO> sessionSeatsDTO,
            String userId
    ) {
        List<Long> idsToLock = sessionSeatsDTO.stream()
                .map(SessionSeatDTO::getId)
                .toList();

        int updatedCount = sessionSeatsRepository
                .unlockReservedSeats(idsToLock, userId);
        System.out.println("Unlocked seats: " + updatedCount);
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void releaseExpiredLocks() {
        int data = this.sessionSeatsRepository.releaseExpiredSeats(LocalDateTime.now());
        System.out.println("Expired locks released: " + data);
    }

    @Override
    @Transactional
    public void initializeSessionSeats(EventSession eventSession) {

        List<Seat> seats = seatRepository.findAllByVenueId(
                eventSession.getVenue().getId()
        );

        List<SessionSeat> sessionSeats = seats.stream()
                .map(seat -> SessionSeat.builder()
                        .eventSession(eventSession)
                        .seat(seat)
                        .status(SessionSeatStatus.AVAILABLE)
                        .build()
                )
                .toList();

        sessionSeatsRepository.saveAll(sessionSeats);

        eventSession.setTotalCapacity(seats.size());
        eventSession.setAvailableCapacity(seats.size());
    }
}
