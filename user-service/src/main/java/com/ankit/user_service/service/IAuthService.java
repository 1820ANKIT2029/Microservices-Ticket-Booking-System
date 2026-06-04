package com.ankit.user_service.service;

import com.ankit.user_service.dto.AuthRequest;
import com.ankit.user_service.dto.LoginResponse;
import com.ankit.user_service.dto.ProfileCreationRequest;
import com.ankit.user_service.dto.SimpleSignupRequest;
import com.ankit.user_service.entity.UserCredential;

public interface IAuthService {
    public String registerUser(SimpleSignupRequest request);
    public LoginResponse login(AuthRequest request);
    public String createProfile(String userId, ProfileCreationRequest request);
}
