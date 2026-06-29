package com.ankit.event_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 50)
    private String status;

    @Column(name = "event_type", length = 100)
    private String eventType;

    @Column(name = "min_age")
    private Integer minAge;

    @Column(name = "venue_id")
    private Long venueId;

    @Column(name = "banner_url", length = 2048)
    private String bannerUrl;

    @Column(name = "poster_url", length = 2048)
    private String posterUrl;

    @Column(name = "is_multi_session")
    private Boolean isMultiSession = false;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "user_id")
    private String userId; // Logical pointer across boundaries to User Service

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private ZonedDateTime updatedAt;

    // Many-to-Many Bridge Table Relationship Mapping
    @ManyToMany
    @JoinTable(
            name = "event_performers",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "performer_id")
    )
    @Builder.Default
    private List<Performer> performers = new ArrayList<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<EventSession> sessions = new ArrayList<>();
}