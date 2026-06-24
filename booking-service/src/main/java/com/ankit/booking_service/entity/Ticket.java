package com.ankit.booking_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "user_id", nullable = false)
    private String userId; // Logical link to User Service

    @Column(name = "event_session_id", nullable = false)
    private Long eventSessionId; // Logical link to Event Service

    @Column(name = "ticket_type_id", nullable = false)
    private Long ticketTypeId; // Logical link to Event Service

    @Column(name = "session_seat_id")
    private Long sessionSeatId; // Logical link to Event Service (session seat id)

    @Column(name = "qr_code", length = 500)
    private String qrCode;

    @Column(name = "bar_code", length = 500)
    private String barCode;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private TicketStatus status = TicketStatus.RESERVED;

    @Column(name = "price_paid", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePaid;

    @Column(name = "is_checked")
    private Boolean isChecked = false;

    @Column(name = "issued_at")
    private ZonedDateTime issuedAt;

    @Column(name = "checked_in_at")
    private ZonedDateTime checkedInAt;
}