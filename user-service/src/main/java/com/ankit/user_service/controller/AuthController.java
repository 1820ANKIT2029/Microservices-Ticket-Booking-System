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
    public ResponseEntity<ApiResponse<String>> signup(@RequestBody SimpleSignupRequest request) {
        String s = authService.registerUser(request);
        return ResponseEntity.ok(new ApiResponse<>(s, "user created"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody AuthRequest request) {
        LoginResponse res = authService.login(request);
        return ResponseEntity.ok(new ApiResponse<>(res, "user logged in"));
    }

    @PostMapping("/create-profile")
    public ResponseEntity<ApiResponse<String>> createProfile(
            @RequestHeader("X-User-Id") String userId, // Injected by API Gateway filter
            @RequestBody ProfileCreationRequest request) {
        String s = authService.createProfile(userId, request);

        return ResponseEntity.ok(new ApiResponse<>(s, "profile created"));
    }
}
