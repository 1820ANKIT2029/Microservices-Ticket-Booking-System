package com.ankit.event_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ticket_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_session_id", nullable = false, updatable = false)
    private EventSession eventSession;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "total_quantity")
    private Integer totalQuantity;

    @Column(name = "available_quantity")
    private Integer availableQuantity;

    @Column(name = "max_per_booking")
    private Integer maxPerBooking;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "sale_start_at")
    private ZonedDateTime saleStartAt;

    @Column(name = "sale_end_at")
    private ZonedDateTime saleEndAt;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "ticket_type_sections",
            joinColumns = @JoinColumn(name = "ticket_type_id")
    )
    @Column(name = "venue_section_id")
    private Set<Long> venueSectionIds = new HashSet<>();
}