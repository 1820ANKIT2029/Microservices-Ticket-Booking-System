package com.ankit.user_service.controller;

import com.ankit.user_service.dto.*;
import com.ankit.user_service.service.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SimpleSignupRequest request) {
        return ResponseEntity.ok(authService.registerUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/create-profile")
    public ResponseEntity<String> createProfile(
            @RequestHeader("X-User-Id") String userId, // Injected by your API Gateway filter
            @RequestBody ProfileCreationRequest request) {

        return ResponseEntity.ok(authService.createProfile(userId, request));
    }
}
