package com.ankit.user_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    private String hashedPassword;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    private String avatarURL;

    @Builder.Default
    private Boolean isActive = true;

    private LocalDateTime lastLoginAt;

    @Column(
        nullable = false,
        updatable = false,
        insertable = false
    )
    private LocalDateTime createdAt;

    @Column(
        nullable = false,
        updatable = false,
        insertable = false
    )
    private LocalDateTime updatedAt;
}
