package com.ankit.event_service.service.impl;

import com.ankit.event_service.dto.SessionSeatDTO;
import com.ankit.event_service.entity.SessionSeat;
import com.ankit.event_service.exception.ResourceNotFoundException;
import com.ankit.event_service.exception.SeatAlreadyBookedException;
import com.ankit.event_service.mapper.SessionSeatMapper;
import com.ankit.event_service.repository.SessionSeatsRepository;
import com.ankit.event_service.service.ISessionSeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionSeatServiceImpl implements ISessionSeatService {
    private final SessionSeatsRepository sessionSeatsRepository;
    private final SessionSeatMapper sessionSeatMapper;

    @Override
    public SessionSeatDTO getSessionSeat(Long sessionSeatId) {
        SessionSeat sessionSeat = this.sessionSeatsRepository
                .findById(sessionSeatId)
                .orElseThrow(() -> new ResourceNotFoundException("Session Seat not Found"));
        return this.sessionSeatMapper.toDto(sessionSeat);
    }

    @Override
    @Transactional // Ankit: this ensures that the database transaction is rolled back if any error occurs
    public List<SessionSeatDTO> lockSessionSeats(List<SessionSeatDTO> sessionSeatsDTO) {
        List<Long> seatIdsToLock = sessionSeatsDTO.stream()
                .map(SessionSeatDTO::getId)
                .toList();

        int updatedCount = sessionSeatsRepository.lockAvailableSeats(seatIdsToLock);

        // Ankit: roll back the transaction if any seat is not available
        if (updatedCount != seatIdsToLock.size()) {
            throw new SeatAlreadyBookedException("One or more selected seats are no longer available.");
        }

        List<SessionSeat> updatedSeats = sessionSeatsRepository.findAllById(seatIdsToLock);
        return updatedSeats.stream()
                .map(this.sessionSeatMapper::toDto)
                .toList();
    }
}
