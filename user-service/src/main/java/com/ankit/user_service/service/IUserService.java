package com.ankit.user_service.service;

import com.ankit.user_service.dto.UserRequestDto;
import com.ankit.user_service.dto.UserResponseDto;

public interface IUserService {
    public UserResponseDto getUser(String userId);
    public void createUser(UserRequestDto userRequestDto);
}
