package com.ankit.user_service.service.impl;

import com.ankit.user_service.dto.UserRequestDto;
import com.ankit.user_service.dto.UserResponseDto;
import com.ankit.user_service.entity.UserProfile;
import com.ankit.user_service.exception.ResourceNotFoundException;
import com.ankit.user_service.mapper.UserMapper;
import com.ankit.user_service.repository.UserProfileRepository;
import com.ankit.user_service.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    private final UserProfileRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserResponseDto getUser(Long userId) {
        UserProfile user = this.userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));
        return this.userMapper.toDto(user);
    }

    @Override
    public UserResponseDto createUser(UserRequestDto userRequestDto) {
        UserProfile user = this.userMapper.toEntity(userRequestDto);
        UserProfile savedUser = this.userRepository.save(user);
        return this.userMapper.toDto(savedUser);
    }
}
