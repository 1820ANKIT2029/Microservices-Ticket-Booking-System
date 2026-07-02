package com.ankit.inventory_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    @Column(name = "event_session_id", nullable = false, updatable = false)
    private Long eventSessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false, updatable = false)
    private Seat seat;

    @Column(name = "override_price", precision = 10, scale = 2)
    private BigDecimal overridePrice;

    @Column(name = "locked_by")
    private String lockedByUserId;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private SessionSeatStatus status = SessionSeatStatus.AVAILABLE;
}