package com.ankit.inventory_service.service.impl;

import com.ankit.inventory_service.dto.EventSessionEvent;
import com.ankit.inventory_service.dto.SessionSeatDTO;
import com.ankit.inventory_service.entity.Seat;
import com.ankit.inventory_service.entity.SessionSeat;
import com.ankit.inventory_service.entity.SessionSeatStatus;
import com.ankit.inventory_service.exception.ResourceNotFoundException;
import com.ankit.inventory_service.exception.SeatAlreadyBookedException;
import com.ankit.inventory_service.mapper.SessionSeatMapper;
import com.ankit.inventory_service.repository.SeatRepository;
import com.ankit.inventory_service.repository.SessionSeatsRepository;
import com.ankit.inventory_service.service.ISessionSeatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class SessionSeatServiceImpl implements ISessionSeatService {
    private final SessionSeatsRepository sessionSeatsRepository;
    private final SeatRepository seatRepository;
    private final SessionSeatMapper sessionSeatMapper;
    private final StringRedisTemplate redisTemplate;

    private static final long LOCK_MINUTES = 10;

    private static final String LUA_LOCK_SCRIPT = """
            for i, key in ipairs(KEYS) do
                if redis.call('get', key) then
                    return 0
                end
            end
    
            for i, key in ipairs(KEYS) do
                redis.call('set', key, ARGV[1], 'EX', ARGV[2])
            end
    
            return 1
    """;

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
    public void lockSessionSeats(
            List<Long> sessionSeatIds, Long eventSessionId, String userId
    ) {
        List<String> redisKeys = sessionSeatIds.stream()
                .map(id -> String.format("lock:eventSession:%s:sessionSeat:%s", eventSessionId, id))
                .toList();

        DefaultRedisScript<Long> script = new DefaultRedisScript<>(LUA_LOCK_SCRIPT, Long.class);
        Long result = redisTemplate.execute(
                script, redisKeys, userId,
                String.valueOf(Duration.ofMinutes(LOCK_MINUTES).toSeconds())
        );
        if (result == null || result == 0L) {
//            log.info("One or more seats in batch {} are already locked in Redis", seatIds);
            throw new SeatAlreadyBookedException(
                    "One or more selected seats are no longer available."
            );
        }

        try {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime expiry = now.plusMinutes(10);
            // prevent deadlock by sorting the seatIds
            List<Long> sortedSeatIds = sessionSeatIds.stream().sorted().toList();
            int lockedCount = this.sessionSeatsRepository
                    .lockSeatsAtomic(
                            sortedSeatIds, userId, expiry, now,
                            SessionSeatStatus.RESERVED,
                            SessionSeatStatus.AVAILABLE
                    );

            if (lockedCount != sortedSeatIds.size()) {
                throw new SeatAlreadyBookedException(
                        "One or more selected seats are no longer available."
                );
            }

            log.info("Successfully locked seats: {}", sortedSeatIds);
        } catch (SeatAlreadyBookedException e) {
            redisTemplate.delete(redisKeys);
            throw e;
        } catch (Exception e) {
            log.error("Database batch lock failed. Rolling back Redis locks for batch.", e);
            redisTemplate.delete(redisKeys);
            throw new RuntimeException("Failed to secure batch seat lock", e);
        }
    }

    @Override
    @Transactional
    public void unlockSessionSeats(
            List<Long> sessionSeatIds,
            Long eventSessionId,
            String userId
    ) {
        int updatedCount = sessionSeatsRepository
                .unlockReservedSeats(
                        sessionSeatIds, userId,
                        SessionSeatStatus.RESERVED,
                        SessionSeatStatus.AVAILABLE
                );
        List<String> redisKeys = sessionSeatIds.stream()
                .map(id ->
                        String.format("lock:eventSession:%s:sessionSeat:%s", eventSessionId, id)
                )
                .toList();
        redisTemplate.delete(redisKeys);
        log.info("Unlocked seats: {}", updatedCount);
    }

    @Override
    @Transactional
    public void bookedSessionSeats(
            List<Long> sessionSeatIds,
            String userId
    ) {
        int updatedCount = sessionSeatsRepository
                .bookReservedSeats(
                        sessionSeatIds, userId,
                        SessionSeatStatus.RESERVED,
                        SessionSeatStatus.BOOKED
                );

        log.info("Booked seats: {}", updatedCount);
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void releaseExpiredLocks() {
        int data = this.sessionSeatsRepository
                .releaseExpiredSeats(
                        LocalDateTime.now(),
                        SessionSeatStatus.RESERVED,
                        SessionSeatStatus.AVAILABLE
                );

        log.info("Expired locks released: {}", data);
    }

    @Override
    @Transactional
    public void initializeSessionSeats(EventSessionEvent eventSessionEvent) {

        List<Seat> seats = seatRepository.findAllByVenueId(
                eventSessionEvent.getVenueId()
        );

        List<SessionSeat> sessionSeats = seats.stream()
                .map(seat -> SessionSeat.builder()
                        .eventSessionId(eventSessionEvent.getId())
                        .seat(seat)
                        .status(SessionSeatStatus.AVAILABLE)
                        .build()
                )
                .toList();

        sessionSeatsRepository.saveAll(sessionSeats);

        log.info("Session Seats initialized for event session {}", eventSessionEvent.getId());
    }
}
