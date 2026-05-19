package com.ankit.event_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_section_id", nullable = false)
    private VenueSection venueSection;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @Column(name = "seat_number", nullable = false, length = 50)
    private String seatNumber;

    @Column(name = "row_label", length = 50)
    private String rowLabel;

    @Column(name = "seat_type", length = 100)
    private String seatType;

    @Column(name = "is_accessible")
    private Boolean isAccessible = false;

    @Column(name = "is_active")
    private Boolean isActive = true;
}
