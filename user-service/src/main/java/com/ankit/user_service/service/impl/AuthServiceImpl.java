package com.ankit.user_service.service.impl;

import com.ankit.user_service.dto.AuthRequest;
import com.ankit.user_service.dto.LoginResponse;
import com.ankit.user_service.dto.ProfileCreationRequest;
import com.ankit.user_service.dto.SimpleSignupRequest;
import com.ankit.user_service.entity.UserCredential;
import com.ankit.user_service.entity.UserProfile;
import com.ankit.user_service.entity.UserRole;
import com.ankit.user_service.exception.InvalidCredentialException;
import com.ankit.user_service.repository.UserCredentialRepository;
import com.ankit.user_service.repository.UserProfileRepository;
import com.ankit.user_service.security.JwtService;
import com.ankit.user_service.service.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {
    private final UserCredentialRepository credentialRepository;
    private final UserProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // 1. SIGNUP: Strictly creates credentials. No profile yet.
    @Transactional
    public String registerUser(SimpleSignupRequest request) {
        if (credentialRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already taken.");
        }

        String sharedUserId = UUID.randomUUID().toString();

        UserCredential credential = UserCredential.builder()
                .userId(sharedUserId)
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.CONSUMER)
                .isActive(true)
                .lastLoginAt(null)
                .build();

        credentialRepository.save(credential);
        return "User registration successful! Please log in to complete your profile.";
    }

    // 2. LOGIN: Detects if this is the first login
    @Transactional
    public LoginResponse login(AuthRequest request) {
        UserCredential credential = credentialRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new InvalidCredentialException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), credential.getPassword())) {
            throw new InvalidCredentialException("Invalid username or password");
        }

        // Determine if this is their first time logging in
        boolean isFirstLogin = (credential.getLastLoginAt() == null);

        // Update last login timestamp
        credential.setLastLoginAt(LocalDateTime.now());
        credentialRepository.save(credential);

        // Generate a JWT token containing the first-login flag
        String token = jwtService.generateToken(credential.getUserId(), credential.getRole().name(), isFirstLogin);

        return new LoginResponse(token, isFirstLogin);
    }

    // 3. PROFILE CREATION: Called immediately after the first login redirection
    @Transactional
    public String createProfile(String userId, ProfileCreationRequest request) {
        // Double-check if the profile already exists to prevent duplication override
        if (profileRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("Profile already exists for this user.");
        }

        UserProfile profile = new UserProfile();
        profile.setUserId(userId);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setEmail(request.getEmail());
        profile.setPhoneNumber(request.getPhoneNumber());
        profile.setAvatarUrl(request.getAvatarUrl());

        profileRepository.save(profile);
        return "Profile created successfully!";
    }
}

