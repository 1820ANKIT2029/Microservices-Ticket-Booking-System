package com.ankit.event_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(
        name = "session_seats",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "event_session_id",
                                "seat_id"
                        }
                )
        }
)
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
    @JoinColumn(name = "event_session_id", nullable = false, updatable = false)
    private EventSession eventSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false, updatable = false)
    private Seat seat;

    @Column(name = "override_price", precision = 10, scale = 2)
    private BigDecimal overridePrice;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SessionSeatStatus status = SessionSeatStatus.AVAILABLE;
}