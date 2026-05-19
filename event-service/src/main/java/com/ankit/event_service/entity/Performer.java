package com.ankit.event_service.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "performers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Performer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 100)
    private String genre;

    @Column(length = 100)
    private String nationality;

    @Column(name = "website_url", length = 2048)
    private String websiteUrl;

    @Column(name = "image_url", length = 2048)
    private String imageUrl;

    @Column(name = "social_link1", length = 2048)
    private String socialLink1;

    @Column(name = "social_link2", length = 2048)
    private String socialLink2;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "modified_at", nullable = false)
    private ZonedDateTime modifiedAt;

    @ManyToMany(mappedBy = "performers")
    @Builder.Default
    private List<Event> events = new ArrayList<>();
}