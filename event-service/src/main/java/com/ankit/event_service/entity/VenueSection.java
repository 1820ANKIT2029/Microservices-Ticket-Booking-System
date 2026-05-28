package com.ankit.event_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "venue_sections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id")
    private Venue venue;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "section_type", length = 100)
    private String sectionType;

    @Column(name = "total_seats")
    private Integer totalSeats;

    @Column(name = "row_count")
    private Integer rowCount;

    @Column(name = "seats_per_row")
    private Integer seatsPerRow;

    @Column(name = "svg_element_id", length = 100)
    private String svgElementId;

    @OneToMany(mappedBy = "venueSection", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Seat> seats = new ArrayList<>();
}
