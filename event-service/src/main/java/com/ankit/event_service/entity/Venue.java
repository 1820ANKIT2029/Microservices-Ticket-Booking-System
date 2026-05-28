package com.ankit.event_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "venues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "address_line1", length = 255)
    private String addressLine1;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String country;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(precision = 8, scale = 6)
    private BigDecimal latitude;

    @Column(length = 100)
    private String timezone;

    @Column(name = "total_capacity")
    private Integer totalCapacity;

    @Column(name = "website_url", length = 2048)
    private String websiteUrl;

    @Column(name = "svg_template_url", length = 2048)
    private String svgTemplateUrl;

    @Column(columnDefinition = "TEXT")
    private String amenities;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @OneToMany(mappedBy = "venue", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<VenueSection> sections = new ArrayList<>();
}
