package com.ankit.user_service.mapper;

import com.ankit.user_service.dto.UserRequestDto;
import com.ankit.user_service.dto.UserResponseDto;
import com.ankit.user_service.entity.User;
import com.ankit.user_service.entity.UserRole;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponseDto toDto(User entity) {
        if (entity == null) return null;

        return UserResponseDto.builder()
                .userId(entity.getUserId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .phoneNumber(entity.getPhoneNumber())
                .avatarUrl(entity.getAvatarUrl())
                .role(entity.getRole())
                .isActive(entity.getIsActive())
                .lastLoginAt(entity.getLastLoginAt())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public User toEntity(UserRequestDto dto) {
        if (dto == null) return null;

        return User.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .avatarUrl(dto.getAvatarUrl())
                .role(dto.getRole() != null ? dto.getRole() : UserRole.CONSUMER)
                .isActive(true)
                .build();
    }
}