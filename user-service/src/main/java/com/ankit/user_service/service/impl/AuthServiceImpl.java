package com.ankit.user_service.service.impl;

import com.ankit.user_service.dto.*;
import com.ankit.user_service.entity.UserCredential;
import com.ankit.user_service.entity.UserRole;
import com.ankit.user_service.exception.InvalidCredentialException;
import com.ankit.user_service.repository.UserCredentialRepository;
import com.ankit.user_service.security.JwtService;
import com.ankit.user_service.service.IAuthService;
import com.ankit.user_service.service.IUserService;
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
    private final IUserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // SIGNUP
    @Transactional
    public String registerUser(SimpleSignupRequest request) {
        if (credentialRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Username is already taken.");
        }

        String sharedUserId = UUID.randomUUID().toString();

        UserCredential credential = UserCredential.builder()
                .userId(sharedUserId)
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .isActive(true)
                .lastLoginAt(null)
                .build();

        credentialRepository.save(credential);

        UserRequestDto userRequestDto = UserRequestDto.builder()
                .userId(sharedUserId)
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .build();

        // Create user profile
        this.userService.createUser(userRequestDto);

        return "User registration successful! Please log in to complete your profile.";
    }

    // LOGIN
    @Transactional
    public LoginResponse login(AuthRequest request) {
        UserCredential credential = credentialRepository.findByEmail(request.getEmail())
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

    // 3. PROFILE CREATION
    @Transactional
    public String createProfile(String userId, ProfileCreationRequest request) {
        return "Profile created successfully!";
    }
}

