package com.ankit.user_service.dto;

import com.ankit.user_service.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String avatarUrl;
    private UserRole role;
    private Boolean isActive;
    private ZonedDateTime lastLoginAt;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}