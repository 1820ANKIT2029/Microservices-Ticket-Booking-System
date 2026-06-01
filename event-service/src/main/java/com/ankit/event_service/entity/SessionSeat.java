package com.ankit.event_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "session_seat_availabilities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_session_id", nullable = false)
    private EventSession eventSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_type_id")
    private TicketType ticketType;

    @Column(name = "override_price", precision = 10, scale = 2)
    private BigDecimal overridePrice;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    @Builder.Default
    private SessionSeatStatus status = SessionSeatStatus.AVAILABLE;
}